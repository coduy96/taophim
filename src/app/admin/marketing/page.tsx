"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Mail01Icon as Mail,
  ArrowRight01Icon as Send,
  UserGroupIcon as Users,
  CheckmarkCircle02Icon as CheckCircle,
  Loading03Icon as Loader,
  Search01Icon as Search
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  xu_balance: number
  role: string
  created_at: string
}

export default function AdminMarketingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [users, setUsers] = useState<Profile[]>([])
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    async function checkAdminAndLoadUsers() {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Check admin role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      // Fetch all users with emails
      const { data: allUsers } = await supabase
        .from("profiles")
        .select("*")
        .not("email", "is", null)
        .order("created_at", { ascending: false })

      setUsers(allUsers || [])
      setLoading(false)
    }

    checkAdminAndLoadUsers()
  }, [router])

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      user.email?.toLowerCase().includes(query) ||
      user.full_name?.toLowerCase().includes(query)
    )
  })

  const MAX_RECIPIENTS = 20

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        if (newSet.size >= MAX_RECIPIENTS) {
          toast.warning(`Chỉ có thể chọn tối đa ${MAX_RECIPIENTS} người nhận mỗi lần gửi`)
          return prev
        }
        newSet.add(userId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set())
    } else {
      // Limit selection to MAX_RECIPIENTS
      const usersToSelect = filteredUsers.slice(0, MAX_RECIPIENTS)
      setSelectedUsers(new Set(usersToSelect.map(u => u.id)))
      if (filteredUsers.length > MAX_RECIPIENTS) {
        toast.warning(`Chỉ có thể chọn tối đa ${MAX_RECIPIENTS} người nhận mỗi lần gửi`)
      }
    }
  }

  const handleSendEmails = async () => {
    if (selectedUsers.size === 0) {
      toast.error("Vui lòng chọn ít nhất một người nhận")
      return
    }

    if (!subject.trim()) {
      toast.error("Vui lòng nhập tiêu đề email")
      return
    }

    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung email")
      return
    }

    setSending(true)

    try {
      const recipients = users
        .filter(u => selectedUsers.has(u.id))
        .map(u => ({
          id: u.id,
          email: u.email,
          full_name: u.full_name
        }))

      // Convert plain text to HTML with line breaks
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #f0f0f0;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #e11d48;
            }
            .content {
              padding: 20px 0;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #f0f0f0;
              color: #888;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Taophim</div>
          </div>
          <div class="content">
            ${content.replace(/\n/g, "<br>")}
          </div>
          <div class="footer">
            <p>Email này được gửi từ Taophim.com</p>
            <p>Nếu bạn có câu hỏi, vui lòng liên hệ hotro@taophim.com</p>
          </div>
        </body>
        </html>
      `

      const response = await fetch("/api/admin/send-marketing-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          subject,
          htmlContent,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send emails")
      }

      toast.success(`Gửi thành công ${result.success.length} email!`)

      if (result.failed.length > 0) {
        toast.warning(`Không thể gửi đến ${result.failed.length} địa chỉ`)
      }

      // Reset form
      setSelectedUsers(new Set())
      setSubject("")
      setContent("")

    } catch (error) {
      console.error("Send email error:", error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi email")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <HugeiconsIcon icon={Loader} className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HugeiconsIcon icon={Mail} className="h-6 w-6 text-primary" />
          </div>
          Email Marketing
        </h1>
        <p className="text-muted-foreground mt-2">
          Gửi email marketing đến người dùng đã đăng ký.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Selection */}
        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <HugeiconsIcon icon={Users} className="h-5 w-5" />
                  Chọn người nhận
                </CardTitle>
                <CardDescription>
                  Đã chọn {selectedUsers.size} / {users.length} người dùng
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
              >
                {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {/* Search */}
            <div className="relative">
              <HugeiconsIcon
                icon={Search}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                placeholder="Tìm kiếm theo email hoặc tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* User List */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/50 cursor-pointer transition-all duration-300"
                  >
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate flex items-center gap-2">
                        {user.full_name || "Chưa cập nhật"}
                        {user.role === "admin" && (
                          <Badge variant="outline" className="text-xs border-red-200 text-red-600">
                            Admin
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    {selectedUsers.has(user.id) && (
                      <HugeiconsIcon icon={CheckCircle} className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </label>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Không tìm thấy người dùng</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Composer */}
        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Send} className="h-5 w-5" />
              Soạn email
            </CardTitle>
            <CardDescription>
              Sử dụng {"{{name}}"} để chèn tên người nhận
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Tiêu đề</Label>
              <Input
                id="subject"
                placeholder="Ví dụ: Ưu đãi đặc biệt dành cho {{name}}"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung</Label>
              <Textarea
                id="content"
                placeholder={`Xin chào {{name}},\n\nChúng tôi có tin vui muốn chia sẻ với bạn...\n\nTrân trọng,\nĐội ngũ Taophim`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[250px] resize-none"
              />
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium">Biến có sẵn:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {"{{name}}"} - Tên người nhận
                </Badge>
                <Badge variant="secondary" className="font-mono text-xs">
                  {"{{email}}"} - Email người nhận
                </Badge>
              </div>
            </div>

            <Button
              onClick={handleSendEmails}
              disabled={sending || selectedUsers.size === 0}
              className="w-full"
              size="lg"
            >
              {sending ? (
                <>
                  <HugeiconsIcon icon={Loader} className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Send} className="mr-2 h-4 w-4" />
                  Gửi email ({selectedUsers.size} người)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lưu ý khi gửi email marketing</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Email sẽ được gửi từ địa chỉ <span className="font-mono text-primary">hotro@taophim.com</span></li>
            <li>Sử dụng {"{{name}}"} trong tiêu đề và nội dung để cá nhân hóa email</li>
            <li>Nếu người dùng chưa cập nhật tên, {"{{name}}"} sẽ được thay bằng &quot;Quý khách&quot;</li>
            <li>Kiểm tra kỹ nội dung trước khi gửi vì không thể thu hồi email</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
