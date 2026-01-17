"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/hooks/use-profile"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera01Icon as Camera } from "@hugeicons/core-free-icons"

import { Profile } from "@/types/database.types"

interface ProfileFormProps {
  initialProfile?: Profile | null
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { profile, isLoading, refetch } = useProfile(initialProfile)
  const [fullName, setFullName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setAvatarPreview(profile.avatar_url)
    }
  }, [profile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("Không tìm thấy thông tin người dùng")

      let avatarUrl = profile?.avatar_url

      if (avatarFile) {
        // Upload avatar
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        // Try to upload to 'avatars' bucket. If it fails, we might need to handle it.
        // Assuming 'avatars' bucket exists and is public. 
        // If not, we can try 'public' bucket or similar, but let's try 'avatars' first as it's standard Supabase.
        // Actually, let's just update the name if avatar upload fails? No, better to show error.
        
        // Strategy: Try 'avatars' bucket.
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            upsert: true
          })

        if (uploadError) {
           throw new Error(`Lỗi tải ảnh: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)
          
        avatarUrl = publicUrl
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success("Cập nhật thông tin thành công")
      refetch() // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật tên và ảnh đại diện của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex flex-col items-center gap-2">
                <div className="relative group">
                  <Avatar className="h-24 w-24 cursor-pointer ring-2 ring-border">
                    <AvatarImage src={avatarPreview || undefined} alt={fullName} />
                    <AvatarFallback className="text-2xl">
                      {fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                  >
                    <HugeiconsIcon icon={Camera} className="size-6" />
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </div>
                <Label htmlFor="avatar-upload" className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Đổi ảnh đại diện
                </Label>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={profile?.email || ""} 
                    disabled 
                    className="bg-muted" 
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Email không thể thay đổi.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ tên của bạn"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
