"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  PlusSignIcon as Plus, 
  Delete02Icon as Trash2, 
  Drag01Icon as GripVertical,
  Upload01Icon as Upload,
  Cancel01Icon as X
} from "@hugeicons/core-free-icons"
import { createClient } from "@/lib/supabase/client"
import { Service, FormConfig, FormField } from "@/types/database.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

// Image Upload Component for Cover Image
interface ImageUploadFieldProps {
  value: string | null
  onChange: (url: string | null) => void
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  disabled?: boolean
}

function ImageUploadField({ value, onChange, onFileSelect, selectedFile, disabled }: ImageUploadFieldProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        onFileSelect(file)
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        toast.error("Vui lòng chọn file hình ảnh")
      }
    }
  }, [onFileSelect])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        onFileSelect(file)
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        toast.error("Vui lòng chọn file hình ảnh")
      }
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFileSelect(null)
    onChange(null)
    setPreviewUrl(null)
  }

  // Display priority: selectedFile preview > existing URL
  const displayUrl = previewUrl || value

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="coverImageUpload"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {displayUrl ? (
          <div className="relative aspect-video w-full">
            <Image
              src={displayUrl}
              alt="Cover preview"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="z-20"
              >
                <HugeiconsIcon icon={X} className="h-4 w-4 mr-1" />
                Xóa ảnh
              </Button>
            </div>
            {selectedFile && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <HugeiconsIcon icon={Upload} className="h-10 w-10 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Kéo thả hoặc click để tải ảnh lên</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF, WEBP (tối đa 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

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
  const [coverImage, setCoverImage] = useState<string | null>(service?.cover_image || null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isActive, setIsActive] = useState(service?.is_active ?? true)
  const [isPublicOnLanding, setIsPublicOnLanding] = useState(service?.is_public_on_landing ?? false)
  
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
      
      let finalCoverImageUrl = coverImage

      // Upload cover image if a new file is selected
      if (coverImageFile) {
        setIsUploading(true)
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (coverImageFile.size > maxSize) {
          toast.error("Ảnh không được vượt quá 5MB")
          setIsLoading(false)
          setIsUploading(false)
          return
        }

        // Generate unique filename
        const fileExt = coverImageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const fileName = `covers/${timestamp}-${randomStr}.${fileExt}`

        // Upload to Supabase storage (service-media bucket)
        const { error: uploadError } = await supabase.storage
          .from('service-media')
          .upload(fileName, coverImageFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error("Không thể tải ảnh lên. Vui lòng thử lại.")
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('service-media')
          .getPublicUrl(fileName)
        
        finalCoverImageUrl = urlData.publicUrl
        setIsUploading(false)
      }
      
      const formConfig: FormConfig = { fields }
      
      const serviceData = {
        name,
        slug,
        description: description || null,
        base_cost: cost,
        cover_image: finalCoverImageUrl || null,
        is_active: isActive,
        is_public_on_landing: isPublicOnLanding,
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
      setIsUploading(false)
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

        <div className="space-y-4">
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
            <Label>Ảnh bìa</Label>
            <ImageUploadField
              value={coverImage}
              onChange={setCoverImage}
              onFileSelect={setCoverImageFile}
              selectedFile={coverImageFile}
              disabled={isLoading || isUploading}
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
                Đang tải ảnh lên...
              </div>
            )}
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

        <div className="flex items-center gap-3 p-4 rounded-lg border">
          <Switch
            id="isPublicOnLanding"
            checked={isPublicOnLanding}
            onCheckedChange={setIsPublicOnLanding}
            disabled={isLoading}
          />
          <div className="flex flex-col">
            <Label htmlFor="isPublicOnLanding" className="cursor-pointer">
              Hiển thị trên trang chủ
            </Label>
            <span className="text-xs text-muted-foreground">
              Dịch vụ sẽ xuất hiện trong mục &ldquo;Dịch vụ nổi bật&rdquo; trên Landing Page
            </span>
          </div>
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
            <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
            Thêm trường
          </Button>
        </div>

        {fields.length > 0 ? (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center">
                  <HugeiconsIcon icon={GripVertical} className="h-5 w-5 text-muted-foreground" />
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
                      <HugeiconsIcon icon={Trash2} className="h-4 w-4 text-destructive" />
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
