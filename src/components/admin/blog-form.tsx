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
  Upload01Icon as Upload,
  Cancel01Icon as X
} from "@hugeicons/core-free-icons"
import { createClient } from "@/lib/supabase/client"
import { BlogPost } from "@/types/database.types"
import { TiptapEditor } from "./tiptap-editor"
import Image from "next/image"

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

interface BlogFormProps {
  post?: BlogPost
  authorId?: string
}

export function BlogForm({ post, authorId }: BlogFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Basic info
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(post?.content || "")
  const [coverImage, setCoverImage] = useState<string | null>(post?.cover_image || null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false)

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || "")
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || "")

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!post) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !slug || !content) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
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
        const fileName = `blog-covers/${timestamp}-${randomStr}.${fileExt}`

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('blog-covers')
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
          .from('blog-covers')
          .getPublicUrl(fileName)

        finalCoverImageUrl = urlData.publicUrl
        setIsUploading(false)
      }

      const postData = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        cover_image: finalCoverImageUrl || null,
        is_published: isPublished,
        published_at: isPublished && !post?.published_at ? new Date().toISOString() : post?.published_at || null,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        updated_at: new Date().toISOString(),
      }

      if (post) {
        // Update existing
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id)

        if (error) {
          console.error('Supabase update error:', error)
          throw error
        }
        toast.success("Cập nhật bài viết thành công!")
      } else {
        // Create new
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            author_id: authorId || null,
          })

        if (error) {
          console.error('Supabase insert error:', error)
          throw error
        }
        toast.success("Tạo bài viết thành công!")
      }

      router.push('/admin/blog')
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
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              placeholder="VD: Hướng dẫn tạo video AI"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Đường dẫn *</Label>
            <Input
              id="slug"
              placeholder="huong-dan-tao-video-ai"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Tóm tắt</Label>
          <Textarea
            id="excerpt"
            placeholder="Mô tả ngắn gọn về bài viết (hiển thị trong danh sách)..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            disabled={isLoading}
            rows={2}
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

        <div className="space-y-2">
          <Label>Nội dung *</Label>
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="Viết nội dung bài viết..."
            disabled={isLoading}
          />
        </div>
      </div>

      {/* SEO Fields */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Cài đặt SEO</h3>
          <p className="text-sm text-muted-foreground">
            Tùy chỉnh tiêu đề và mô tả hiển thị trên kết quả tìm kiếm
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">
              Tiêu đề SEO
              <span className="text-muted-foreground ml-2 text-xs">
                ({metaTitle.length}/70)
              </span>
            </Label>
            <Input
              id="metaTitle"
              placeholder="Để trống sẽ dùng tiêu đề bài viết"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value.slice(0, 70))}
              disabled={isLoading}
              maxLength={70}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">
              Mô tả SEO
              <span className="text-muted-foreground ml-2 text-xs">
                ({metaDescription.length}/160)
              </span>
            </Label>
            <Textarea
              id="metaDescription"
              placeholder="Để trống sẽ dùng tóm tắt bài viết"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
              disabled={isLoading}
              rows={2}
              maxLength={160}
            />
          </div>
        </div>
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center gap-3 p-4 rounded-lg border">
        <Switch
          id="isPublished"
          checked={isPublished}
          onCheckedChange={setIsPublished}
          disabled={isLoading}
        />
        <div className="flex flex-col">
          <Label htmlFor="isPublished" className="cursor-pointer">
            Xuất bản
          </Label>
          <span className="text-xs text-muted-foreground">
            Bật để công khai bài viết trên trang blog
          </span>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          {post ? 'Cập nhật bài viết' : 'Tạo bài viết'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Hủy
        </Button>
      </div>
    </form>
  )
}
