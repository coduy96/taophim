-- Fix race condition in cancel_order function
-- The bug: concurrent cancel requests could both pass the status check
-- and double-refund the user's Xu balance

CREATE OR REPLACE FUNCTION public.cancel_order(p_order_id uuid, p_admin_note text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_order RECORD;
BEGIN
  -- Get order details WITH ROW LOCK to prevent race conditions
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;  -- This locks the row until transaction completes

  IF v_order IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Order cannot be cancelled from status: %', v_order.status;
  END IF;

  -- Refund frozen Xu back to available balance
  -- Also ensure frozen_xu doesn't go negative (sanity check)
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

-- Also fix the same issue in complete_order function
CREATE OR REPLACE FUNCTION public.complete_order(p_order_id uuid, p_admin_output jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_order RECORD;
BEGIN
  -- Get order details WITH ROW LOCK to prevent race conditions
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;  -- This locks the row until transaction completes

  IF v_order IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Order cannot be completed from status: %', v_order.status;
  END IF;

  -- Deduct frozen Xu (payment is finalized)
  -- Also ensure frozen_xu doesn't go negative (sanity check)
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
