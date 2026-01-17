import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon as ArrowLeft } from "@hugeicons/core-free-icons"
import { ServiceForm } from "@/components/admin/service-form"

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch service
  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !service) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/services">
          <HugeiconsIcon icon={ArrowLeft} className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa dịch vụ</CardTitle>
            <CardDescription>
              Cập nhật thông tin dịch vụ &ldquo;{service.name}&rdquo;.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceForm service={service} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
