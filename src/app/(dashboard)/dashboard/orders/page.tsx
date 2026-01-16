import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrderList } from "./order-list"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon as ShoppingBag } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order: selectedOrderId } = await searchParams
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      services (name, slug, form_config)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    // You might want to show an error state here
  }

  // Type casting to match the interface expected by OrderList
  interface FormField {
    id: string
    label: string
    type: string
  }
  interface FormConfig {
    fields: FormField[]
  }
  interface OrderWithService {
    id: string
    status: string
    total_cost: number
    user_inputs: Record<string, unknown>
    admin_output: { result_url?: string } | null
    admin_note: string | null
    created_at: string
    updated_at: string
    services: {
      name: string
      slug: string
      form_config: FormConfig | null
    }
  }
  const typedOrders = (orders || []) as OrderWithService[]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Lịch sử đơn hàng
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và theo dõi trạng thái các video AI của bạn.
          </p>
        </div>
        <Button asChild className="rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <Link href="/dashboard/services">
            <HugeiconsIcon icon={ShoppingBag} className="mr-2 h-4 w-4" />
            Tạo đơn mới
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <OrderList orders={typedOrders} initialOrderId={selectedOrderId} />
    </div>
  )
}
