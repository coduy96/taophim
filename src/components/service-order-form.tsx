"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Upload01Icon as Upload, 
  Cancel01Icon as X, 
  Image01Icon as FileImage, 
  Video01Icon as FileVideo, 
  File01Icon as FileIcon 
} from "@hugeicons/core-free-icons"
import { createClient } from "@/lib/supabase/client"
import { Service, FormConfig, FormField } from "@/types/database.types"

interface ServiceOrderFormProps {
  service: Service
  hasEnoughBalance: boolean
  userBalance: number
}

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

interface FileUploadProps {
  field: FormField
  value: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
}

function FileUploadField({ field, value, onChange, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

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
      onChange(e.dataTransfer.files[0])
    }
  }, [onChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0])
    }
  }

  const getAccept = () => {
    switch (field.type) {
      case 'image': return 'image/*'
      case 'video': return 'video/*'
      default: return field.accept || '*/*'
    }
  }

  const getIcon = () => {
    switch (field.type) {
      case 'image': return <HugeiconsIcon icon={FileImage} className="h-8 w-8 text-muted-foreground" />
      case 'video': return <HugeiconsIcon icon={FileVideo} className="h-8 w-8 text-muted-foreground" />
      default: return <HugeiconsIcon icon={FileIcon} className="h-8 w-8 text-muted-foreground" />
    }
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={field.id}
        accept={getAccept()}
        onChange={handleChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      {value ? (
        <div className="flex items-center justify-center gap-3">
          {getIcon()}
          <div className="text-left flex-1">
            <p className="font-medium truncate">{value.name}</p>
            <p className="text-sm text-muted-foreground">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              onChange(null)
            }}
            disabled={disabled}
          >
            <HugeiconsIcon icon={X} className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <HugeiconsIcon icon={Upload} className="h-8 w-8 mx-auto text-muted-foreground" />
          <div>
            <p className="font-medium">Kéo thả hoặc click để tải lên</p>
            <p className="text-sm text-muted-foreground">
              {field.type === 'image' ? 'PNG, JPG, GIF' : 
               field.type === 'video' ? 'MP4, MOV, AVI' : 'Tất cả định dạng'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function ServiceOrderForm({ service, hasEnoughBalance, userBalance }: ServiceOrderFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, string | boolean | File | null>>({})
  const [duration, setDuration] = useState<number>(5)

  const formConfig = (service.form_config as unknown as FormConfig) || { fields: [] }
  const fields = formConfig.fields || []

  // Calculate total cost based on duration
  const totalCost = duration * service.cost_per_second
  const canAfford = userBalance >= totalCost

  const handleFieldChange = (fieldId: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canAfford) {
      toast.error("Số dư không đủ để tạo đơn hàng")
      return
    }

    if (duration < 1) {
      toast.error("Thời lượng video phải ít nhất 1 giây")
      return
    }

    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.id]) {
        toast.error(`Vui lòng điền "${field.label}"`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Vui lòng đăng nhập lại")
        return
      }

      // Upload files first
      const userInputs: Record<string, string | boolean | number> = {
        duration_seconds: duration,
      }

      for (const field of fields) {
        const value = formData[field.id]

        if (value instanceof File) {
          // Upload to Supabase Storage
          const fileExt = value.name.split('.').pop()
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('order-assets')
            .upload(`input/${fileName}`, value)

          if (uploadError) {
            throw new Error(`Lỗi tải file: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from('order-assets')
            .getPublicUrl(`input/${fileName}`)

          userInputs[field.id] = publicUrl
        } else if (value !== null && value !== undefined) {
          userInputs[field.id] = value as string | boolean
        }
      }

      // Create order using the stored function
      const { error: orderError } = await supabase.rpc('create_order', {
        p_service_id: service.id,
        p_total_cost: totalCost,
        p_user_inputs: userInputs
      })

      if (orderError) {
        throw new Error(orderError.message)
      }

      toast.success("Đơn hàng đã được tạo thành công!")
      router.push('/dashboard/orders')
      router.refresh()
    } catch (error) {
      console.error('Order creation error:', error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo đơn hàng")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id]

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isSubmitting || !canAfford}
          />
        )
      
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isSubmitting || !canAfford}
            rows={4}
          />
        )
      
      case 'image':
      case 'video':
      case 'file':
        return (
          <FileUploadField
            field={field}
            value={value as File | null}
            onChange={(file) => handleFieldChange(field.id, file)}
            disabled={isSubmitting || !canAfford}
          />
        )
      
      case 'dropdown':
        return (
          <Select
            value={(value as string) || ''}
            onValueChange={(v) => handleFieldChange(field.id, v)}
            disabled={isSubmitting || !canAfford}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Chọn..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'toggle':
        return (
          <div className="flex items-center gap-3">
            <Switch
              id={field.id}
              checked={(value as boolean) || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              disabled={isSubmitting || !canAfford}
            />
            <Label htmlFor={field.id} className="text-sm text-muted-foreground">
              {field.placeholder || "Bật/Tắt"}
            </Label>
          </div>
        )
      
      default:
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isSubmitting || !canAfford}
          />
        )
    }
  }

  // If no form config, show default file upload
  if (fields.length === 0) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="duration">Thời lượng video (giây) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="300"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">
            {formatXu(service.cost_per_second)} Xu/giây × {duration} giây = <span className="font-medium text-foreground">{formatXu(totalCost)} Xu</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tải lên file nguồn</Label>
          <FileUploadField
            field={{ id: 'source_file', type: 'file', label: 'File nguồn', required: true }}
            value={formData['source_file'] as File | null}
            onChange={(file) => handleFieldChange('source_file', file)}
            disabled={isSubmitting || !canAfford}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Ghi chú thêm (tùy chọn)</Label>
          <Textarea
            id="notes"
            placeholder="Mô tả yêu cầu của bạn..."
            value={(formData['notes'] as string) || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            disabled={isSubmitting || !canAfford}
            rows={4}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting || !canAfford}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Đang xử lý...
            </>
          ) : (
            <>
              Tạo đơn hàng - {formatXu(totalCost)} Xu
            </>
          )}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="duration">Thời lượng video (giây) *</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          max="300"
          value={duration}
          onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          {formatXu(service.cost_per_second)} Xu/giây × {duration} giây = <span className="font-medium text-foreground">{formatXu(totalCost)} Xu</span>
        </p>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {renderField(field)}
        </div>
      ))}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting || !canAfford}
      >
        {isSubmitting ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Đang xử lý...
          </>
        ) : (
          <>
            Tạo đơn hàng - {formatXu(totalCost)} Xu
          </>
        )}
      </Button>
    </form>
  )
}
