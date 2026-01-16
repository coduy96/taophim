"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Service, FormConfig, FormField } from "@/types/database.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ServiceFormProps {
  service?: Service
}

const fieldTypes = [
  { value: 'text', label: 'Văn bản ngắn' },
  { value: 'textarea', label: 'Văn bản dài' },
  { value: 'image', label: 'Hình ảnh' },
  { value: 'video', label: 'Video' },
  { value: 'file', label: 'File bất kỳ' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'toggle', label: 'Bật/Tắt' },
]

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Basic info
  const [name, setName] = useState(service?.name || "")
  const [slug, setSlug] = useState(service?.slug || "")
  const [description, setDescription] = useState(service?.description || "")
  const [baseCost, setBaseCost] = useState(service?.base_cost?.toString() || "")
  const [coverImage, setCoverImage] = useState(service?.cover_image || "")
  const [isActive, setIsActive] = useState(service?.is_active ?? true)
  
  // Form fields
  const existingConfig = service?.form_config as unknown as FormConfig
  const [fields, setFields] = useState<FormField[]>(existingConfig?.fields || [])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!service) {
      setSlug(generateSlug(value))
    }
  }

  const addField = () => {
    setFields([...fields, {
      id: `field_${Date.now()}`,
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
    }])
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFields(fields.map((f, i) => i === index ? { ...f, ...updates } : f))
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !slug || !baseCost) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    const cost = parseInt(baseCost)
    if (isNaN(cost)) {
      toast.error("Chi phí phải là một số hợp lệ")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const formConfig: FormConfig = { fields }
      
      const serviceData = {
        name,
        slug,
        description: description || null,
        base_cost: cost,
        cover_image: coverImage || null,
        is_active: isActive,
        form_config: JSON.parse(JSON.stringify(formConfig)),
        updated_at: new Date().toISOString(),
      }

      // Log the data being sent for debugging
      console.log('Submitting service data:', serviceData)

      if (service) {
        // Update existing
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', service.id)

        if (error) {
          console.error('Supabase update error:', error)
          throw error
        }
        toast.success("Cập nhật dịch vụ thành công!")
      } else {
        // Create new
        const { error } = await supabase
          .from('services')
          .insert(serviceData)

        if (error) {
          console.error('Supabase insert error:', error)
          throw error
        }
        toast.success("Tạo dịch vụ thành công!")
      }

      router.push('/admin/services')
      router.refresh()
    } catch (error: unknown) {
      console.error('Full error object:', error)
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Tên dịch vụ *</Label>
            <Input
              id="name"
              placeholder="VD: Ghép mặt Video"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              placeholder="ghep-mat-video"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            placeholder="Mô tả chi tiết về dịch vụ..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="baseCost">Chi phí (Xu) *</Label>
            <Input
              id="baseCost"
              type="number"
              min="0"
              placeholder="100"
              value={baseCost}
              onChange={(e) => setBaseCost(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImage">URL ảnh bìa</Label>
            <Input
              id="coverImage"
              placeholder="https://..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg border">
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={setIsActive}
            disabled={isLoading}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Kích hoạt dịch vụ (hiển thị cho người dùng)
          </Label>
        </div>
      </div>

      {/* Form Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Cấu hình form nhập liệu</h3>
            <p className="text-sm text-muted-foreground">
              Định nghĩa các trường thông tin cần thu thập từ khách hàng
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addField}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm trường
          </Button>
        </div>

        {fields.length > 0 ? (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 grid gap-3 md:grid-cols-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Loại</Label>
                    <Select
                      value={field.type}
                      onValueChange={(v) => updateField(index, { type: v as FormField['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nhãn</Label>
                    <Input
                      placeholder="VD: Ảnh khuôn mặt"
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Placeholder</Label>
                    <Input
                      placeholder="Gợi ý..."
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.required || false}
                        onCheckedChange={(checked) => updateField(index, { required: checked })}
                      />
                      <Label className="text-xs">Bắt buộc</Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-sm">
              Chưa có trường nào. Click &ldquo;Thêm trường&rdquo; để bắt đầu.
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          {service ? 'Cập nhật dịch vụ' : 'Tạo dịch vụ'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Hủy
        </Button>
      </div>
    </form>
  )
}
