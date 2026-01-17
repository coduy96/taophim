import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"
import { PasswordForm } from "./password-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  UserCircleIcon as UserIcon, 
  SecurityCheckIcon as ShieldCheck 
} from "@hugeicons/core-free-icons"

export const metadata = {
  title: "Cài đặt | Taophim",
  description: "Quản lý thông tin tài khoản và cài đặt cá nhân.",
}

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý thông tin cá nhân và bảo mật tài khoản.
        </p>
      </div>
      
      <Separator />

      {/* Content */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <HugeiconsIcon icon={UserIcon} className="size-4" />
            Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <HugeiconsIcon icon={ShieldCheck} className="size-4" />
            Bảo mật
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileForm initialProfile={profile} />
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <PasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
