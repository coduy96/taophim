-- Security Fix: Add authorization checks to all SECURITY DEFINER RPC functions
-- These functions bypass RLS, so they MUST enforce their own access control.

-- =============================================================================
-- Fix 1: top_up_user — restrict to admin only
-- Risk: Any authenticated user could give themselves unlimited Xu
-- Callers: Admin topup form (admin user)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.top_up_user(p_email text, p_amount integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_user_id uuid;
BEGIN
  -- Authorization: admin only
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Input validation
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Find user by email
  SELECT id INTO v_user_id FROM public.profiles WHERE email = p_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %', p_email;
  END IF;

  -- Update balance
  UPDATE public.profiles SET xu_balance = xu_balance + p_amount WHERE id = v_user_id;

  -- Create transaction record
  INSERT INTO public.transactions (user_id, amount, type)
  VALUES (v_user_id, p_amount, 'deposit');
END;
$function$;

-- =============================================================================
-- Fix 2: increment_xu — restrict to service_role only
-- Risk: Any authenticated user could give any user_id unlimited Xu
-- Callers: PayOS webhook edge function (service_role only)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.increment_xu(p_user_id uuid, p_amount int)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Authorization: service_role only (called by PayOS webhook edge function)
  IF (SELECT auth.role()) != 'service_role' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Input validation
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  UPDATE public.profiles
  SET xu_balance = xu_balance + p_amount
  WHERE id = p_user_id;
END;
$function$;

-- =============================================================================
-- Fix 3: cancel_order — restrict to admin or service_role
-- Risk: Any authenticated user could cancel any order and get Xu refunded
-- Callers: Admin order-action-form (admin user), FAL webhook (service_role)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.cancel_order(p_order_id uuid, p_admin_note text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_order RECORD;
BEGIN
  -- Authorization: admin or service_role
  IF NOT public.is_admin() AND (SELECT auth.role()) != 'service_role' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Get order details WITH ROW LOCK to prevent race conditions
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF v_order IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Order cannot be cancelled from status: %', v_order.status;
  END IF;

  -- Refund frozen Xu back to available balance
  UPDATE public.profiles
  SET xu_balance = xu_balance + v_order.total_cost,
      frozen_xu = GREATEST(frozen_xu - v_order.total_cost, 0)
  WHERE id = v_order.user_id;

  -- Create refund transaction
  INSERT INTO public.transactions (user_id, amount, type, order_id)
  VALUES (v_order.user_id, v_order.total_cost, 'refund', p_order_id);

  -- Update order status
  UPDATE public.orders
  SET status = 'cancelled',
      admin_note = p_admin_note,
      updated_at = now()
  WHERE id = p_order_id;
END;
$function$;

-- =============================================================================
-- Fix 4: complete_order — restrict to admin or service_role
-- Risk: Any authenticated user could complete any order with fake output
-- Callers: Admin order-action-form (admin user), FAL webhook (service_role)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.complete_order(p_order_id uuid, p_admin_output jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_order RECORD;
BEGIN
  -- Authorization: admin or service_role
  IF NOT public.is_admin() AND (SELECT auth.role()) != 'service_role' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Get order details WITH ROW LOCK to prevent race conditions
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF v_order IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Order cannot be completed from status: %', v_order.status;
  END IF;

  -- Deduct frozen Xu (payment is finalized)
  UPDATE public.profiles
  SET frozen_xu = GREATEST(frozen_xu - v_order.total_cost, 0)
  WHERE id = v_order.user_id;

  -- Create expense transaction
  INSERT INTO public.transactions (user_id, amount, type, order_id)
  VALUES (v_order.user_id, v_order.total_cost, 'expense', p_order_id);

  -- Update order status
  UPDATE public.orders
  SET status = 'completed',
      admin_output = p_admin_output,
      updated_at = now()
  WHERE id = p_order_id;
END;
$function$;

-- =============================================================================
-- Fix 5: create_order — add server-side cost validation
-- Risk: User could send p_total_cost: 1 for a service costing 100 Xu
-- Callers: Service order form (authenticated user)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.create_order(p_service_id uuid, p_total_cost integer, p_user_inputs jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_user_id uuid;
  v_order_id uuid;
  v_current_balance int;
  v_service RECORD;
  v_duration int;
  v_expected_cost int;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate service exists and is active
  SELECT * INTO v_service FROM public.services
  WHERE id = p_service_id AND is_active = true AND deleted_at IS NULL;

  IF v_service IS NULL THEN
    RAISE EXCEPTION 'Service not found or inactive';
  END IF;

  -- Validate cost matches service pricing (duration * cost_per_second)
  v_duration := COALESCE((p_user_inputs->>'duration_seconds')::int, v_service.min_duration, 1);

  IF v_service.min_duration IS NOT NULL AND v_duration < v_service.min_duration THEN
    RAISE EXCEPTION 'Duration below minimum';
  END IF;

  v_expected_cost := v_duration * v_service.cost_per_second;

  IF p_total_cost != v_expected_cost THEN
    RAISE EXCEPTION 'Cost mismatch: expected %, got %', v_expected_cost, p_total_cost;
  END IF;

  -- Check balance
  SELECT xu_balance INTO v_current_balance FROM public.profiles WHERE id = v_user_id;
  IF v_current_balance < p_total_cost THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Freeze Xu (move from available to frozen)
  UPDATE public.profiles
  SET xu_balance = xu_balance - p_total_cost,
      frozen_xu = frozen_xu + p_total_cost
  WHERE id = v_user_id;

  -- Create order
  INSERT INTO public.orders (user_id, service_id, total_cost, user_inputs, status)
  VALUES (v_user_id, p_service_id, p_total_cost, p_user_inputs, 'pending')
  RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$function$;
