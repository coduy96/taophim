"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
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
import { Service, FormConfig, FormField, DurationConfig, FixedDurationConfig, RangeDurationConfig, VideoBasedDurationConfig } from "@/types/database.types"
import { triggerProfileRefresh } from "@/hooks/use-profile"
import { useNavigation } from "@/contexts/navigation-context"

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

// Helper to create a stable File copy by reading into memory
// This prevents ERR_UPLOAD_FILE_CHANGED when browser garbage collects file references
async function createStableFileCopy(file: File): Promise<File> {
  const arrayBuffer = await file.arrayBuffer()
  const blob = new Blob([arrayBuffer], { type: file.type })
  return new File([blob], file.name, { type: file.type, lastModified: file.lastModified })
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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const stableFile = await createStableFileCopy(e.dataTransfer.files[0])
      onChange(stableFile)
    }
  }, [onChange])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const stableFile = await createStableFileCopy(e.target.files[0])
      onChange(stableFile)
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
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <div className="shrink-0">
            {getIcon()}
          </div>
          <div className="text-left flex-1 min-w-0 overflow-hidden">
            <p className="font-medium truncate max-w-full">{value.name}</p>
            <p className="text-sm text-muted-foreground">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
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

// Duration Selector Components
interface FixedDurationSelectorProps {
  config: FixedDurationConfig
  value: number
  onChange: (value: number) => void
  costPerSecond: number
  minDuration: number
  disabled?: boolean
}

function FixedDurationSelector({ config, value, onChange, costPerSecond, minDuration, disabled }: FixedDurationSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Chọn thời lượng video *</Label>
      <div className="flex flex-wrap gap-2">
        {config.options.map((opt) => {
          const cost = opt * costPerSecond
          const isBelowMin = opt < minDuration
          return (
            <Button
              key={opt}
              type="button"
              variant={value === opt ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(opt)}
              disabled={disabled || isBelowMin}
              className={`min-w-[100px] ${isBelowMin ? 'opacity-50 line-through' : ''}`}
              title={isBelowMin ? `Tối thiểu ${minDuration} giây` : undefined}
            >
              {opt}s - {formatXu(cost)} Xu
            </Button>
          )
        })}
      </div>
      {minDuration > 1 && (
        <p className="text-xs text-amber-600">Tối thiểu {minDuration} giây</p>
      )}
    </div>
  )
}

interface RangeDurationSelectorProps {
  config: RangeDurationConfig
  value: number
  onChange: (value: number) => void
  costPerSecond: number
  minDuration: number
  disabled?: boolean
}

function RangeDurationSelector({ config, value, onChange, costPerSecond, minDuration, disabled }: RangeDurationSelectorProps) {
  const cost = value * costPerSecond
  // Use the higher of config.min and service minDuration
  const effectiveMin = Math.max(config.min, minDuration)
  const isBelowMin = value < minDuration

  return (
    <div className="space-y-4">
      <Label>Chọn thời lượng video *</Label>
      <div className="space-y-3">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={effectiveMin}
          max={config.max}
          step={config.step || 1}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{effectiveMin}s</span>
          <span className={`font-medium ${isBelowMin ? 'text-red-600' : 'text-foreground'}`}>{value}s</span>
          <span>{config.max}s</span>
        </div>
      </div>
      <p className="text-sm">
        Chi phí: <span className="font-medium">{formatXu(cost)} Xu</span>
        <span className="text-muted-foreground ml-1">({formatXu(costPerSecond)} Xu/giây)</span>
        {minDuration > 1 && (
          <span className="text-amber-600 ml-2">(tối thiểu {minDuration} giây)</span>
        )}
      </p>
    </div>
  )
}

interface VideoBasedDurationProps {
  config: VideoBasedDurationConfig
  videoFile: File | null
  value: number
  onChange: (value: number) => void
  costPerSecond: number
  minDuration: number
}

function VideoBasedDuration({ config, videoFile, value, onChange, costPerSecond, minDuration }: VideoBasedDurationProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedDuration, setDetectedDuration] = useState<number | null>(null)
  const [isTooShort, setIsTooShort] = useState(false)

  useEffect(() => {
    if (!videoFile) {
      setDetectedDuration(null)
      setIsTooShort(false)
      return
    }

    setIsDetecting(true)
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      let duration = Math.ceil(video.duration)
      // Apply max constraint if configured
      if (config.max_duration && duration > config.max_duration) {
        duration = config.max_duration
      }
      setDetectedDuration(duration)
      setIsTooShort(duration < minDuration)
      onChange(duration)
      setIsDetecting(false)
      URL.revokeObjectURL(video.src)
    }

    video.onerror = () => {
      setIsDetecting(false)
      setDetectedDuration(null)
      setIsTooShort(false)
      URL.revokeObjectURL(video.src)
    }

    video.src = URL.createObjectURL(videoFile)
  }, [videoFile, config.max_duration, minDuration, onChange])

  const cost = value * costPerSecond

  if (!videoFile) {
    return (
      <div className="space-y-2">
        <Label>Thời lượng video</Label>
        <p className="text-sm text-muted-foreground">
          Tải lên video nguồn để tự động xác định thời lượng
          {minDuration > 1 && (
            <span className="text-amber-600 ml-1">(tối thiểu {minDuration} giây)</span>
          )}
        </p>
      </div>
    )
  }

  if (isDetecting) {
    return (
      <div className="space-y-2">
        <Label>Thời lượng video</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="h-4 w-4" />
          Đang phát hiện thời lượng...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label>Thời lượng video</Label>
      <p className="text-sm">
        <span className={`font-medium ${isTooShort ? 'text-red-600' : ''}`}>{detectedDuration}s</span>
        <span className="text-muted-foreground ml-1">(tự động)</span>
        {config.max_duration && detectedDuration === config.max_duration && (
          <span className="text-amber-600 ml-2">(giới hạn {config.max_duration}s)</span>
        )}
        {isTooShort && (
          <span className="text-red-600 ml-2">(video quá ngắn, tối thiểu {minDuration} giây)</span>
        )}
      </p>
      <p className="text-sm">
        Chi phí: <span className="font-medium">{formatXu(cost)} Xu</span>
      </p>
    </div>
  )
}

interface LegacyDurationInputProps {
  value: number
  onChange: (value: number) => void
  costPerSecond: number
  minDuration: number
  disabled?: boolean
}

function LegacyDurationInput({ value, onChange, costPerSecond, minDuration, disabled }: LegacyDurationInputProps) {
  const cost = value * costPerSecond

  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Thời lượng video (giây) *</Label>
      <Input
        id="duration"
        type="number"
        min={minDuration}
        max="300"
        value={value}
        onChange={(e) => onChange(Math.max(minDuration, parseInt(e.target.value) || minDuration))}
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground">
        {formatXu(costPerSecond)} Xu/giây × {value} giây = <span className="font-medium text-foreground">{formatXu(cost)} Xu</span>
        {minDuration > 1 && (
          <span className="ml-2 text-amber-600">(tối thiểu {minDuration} giây)</span>
        )}
      </p>
    </div>
  )
}

export function ServiceOrderForm({ service, hasEnoughBalance, userBalance }: ServiceOrderFormProps) {
  const router = useRouter()
  const { startNavigation } = useNavigation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, string | boolean | File | null>>({})

  const formConfig = (service.form_config as unknown as FormConfig) || { fields: [] }
  const fields = formConfig.fields || []
  const durationConfig = service.duration_config as unknown as DurationConfig

  // Initialize duration based on config
  const getInitialDuration = (): number => {
    if (!durationConfig) return 5 // Legacy default
    switch (durationConfig.mode) {
      case 'fixed':
        return durationConfig.default_option ?? durationConfig.options[0] ?? 5
      case 'range':
        return durationConfig.default_value ?? durationConfig.min
      case 'video_based':
        return 0 // Will be set when video is uploaded
      default:
        return 5
    }
  }

  const [duration, setDuration] = useState<number>(getInitialDuration)

  // Calculate total cost based on duration
  const totalCost = duration * service.cost_per_second
  const canAfford = userBalance >= totalCost

  const handleFieldChange = (fieldId: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  // Get video file for video-based duration detection
  const getVideoFile = (): File | null => {
    if (!durationConfig || durationConfig.mode !== 'video_based') return null
    const videoFieldId = durationConfig.source_field_id
    const videoValue = formData[videoFieldId]
    return videoValue instanceof File ? videoValue : null
  }

  // Get minimum duration from service (default to 1 if not set)
  const minDuration = service.min_duration ?? 1

  const renderDurationSelector = () => {
    if (!durationConfig) {
      // Legacy mode
      return (
        <LegacyDurationInput
          value={duration}
          onChange={setDuration}
          costPerSecond={service.cost_per_second}
          minDuration={minDuration}
          disabled={isSubmitting}
        />
      )
    }

    switch (durationConfig.mode) {
      case 'fixed':
        return (
          <FixedDurationSelector
            config={durationConfig}
            value={duration}
            onChange={setDuration}
            costPerSecond={service.cost_per_second}
            minDuration={minDuration}
            disabled={isSubmitting || !canAfford}
          />
        )
      case 'range':
        return (
          <RangeDurationSelector
            config={durationConfig}
            value={duration}
            onChange={setDuration}
            costPerSecond={service.cost_per_second}
            minDuration={minDuration}
            disabled={isSubmitting || !canAfford}
          />
        )
      case 'video_based':
        return (
          <VideoBasedDuration
            config={durationConfig}
            videoFile={getVideoFile()}
            value={duration}
            onChange={setDuration}
            costPerSecond={service.cost_per_second}
            minDuration={minDuration}
          />
        )
      default:
        return (
          <LegacyDurationInput
            value={duration}
            onChange={setDuration}
            costPerSecond={service.cost_per_second}
            minDuration={minDuration}
            disabled={isSubmitting}
          />
        )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canAfford) {
      toast.error("Số dư không đủ để tạo đơn hàng")
      return
    }

    // Validate minimum duration (use service's min_duration or default to 1)
    const minDuration = service.min_duration ?? 1
    if (duration < minDuration) {
      toast.error(`Thời lượng video không được nhỏ hơn ${minDuration} giây`)
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
      const { data: orderId, error: orderError } = await supabase.rpc('create_order', {
        p_service_id: service.id,
        p_total_cost: totalCost,
        p_user_inputs: userInputs
      })

      if (orderError) {
        throw new Error(orderError.message)
      }

      // Refresh profile to update Xu balance in sidebar (xu_balance decreased, frozen_xu increased)
      triggerProfileRefresh()

      // Submit to FAL for automated processing
      try {
        const falResponse = await fetch('/api/fal/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            serviceSlug: service.slug,
            userInputs,
          }),
        })

        if (!falResponse.ok) {
          // Auto processing submission failed, but order was created
          // Order will remain in pending status for manual processing
          console.error('Auto processing submission failed, order requires manual processing')
          toast.success("Đơn hàng đã được tạo. Đang chờ xử lý...")
        } else {
          toast.success("Đơn hàng đã được tạo và đang xử lý tự động!")
        }
      } catch (processingError) {
        // Auto processing submission failed, order was still created
        console.error('Auto processing submission error:', processingError)
        toast.success("Đơn hàng đã được tạo. Đang chờ xử lý...")
      }

      startNavigation('/dashboard/orders')
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
        {renderDurationSelector()}

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
          disabled={isSubmitting || !canAfford || (durationConfig?.mode === 'video_based' && duration === 0)}
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
      {renderDurationSelector()}

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
        disabled={isSubmitting || !canAfford || (durationConfig?.mode === 'video_based' && duration === 0)}
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
