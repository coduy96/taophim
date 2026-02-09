const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB - Supabase Storage / FAL limit
const MAX_DIMENSION = 3840 // Safety margin under FAL's 3850px limit
const INITIAL_QUALITY = 0.92
const QUALITY_STEP = 0.05
const MIN_QUALITY = 0.7

export interface CompressionResult {
  file: File
  wasCompressed: boolean
  originalSize: number
  compressedSize: number
  originalDimensions: { width: number; height: number }
  finalDimensions: { width: number; height: number }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Không thể đọc file ảnh. Vui lòng thử file khác.'))
    }
    img.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Không thể nén ảnh. Vui lòng thử file khác.'))
      },
      'image/jpeg',
      quality
    )
  })
}

export async function compressImageFile(file: File): Promise<CompressionResult> {
  const img = await loadImage(file)

  const originalDimensions = { width: img.naturalWidth, height: img.naturalHeight }
  const needsResize = img.naturalWidth > MAX_DIMENSION || img.naturalHeight > MAX_DIMENSION
  const needsSizeReduction = file.size > MAX_FILE_SIZE

  // Early return if already within limits
  if (!needsResize && !needsSizeReduction) {
    return {
      file,
      wasCompressed: false,
      originalSize: file.size,
      compressedSize: file.size,
      originalDimensions,
      finalDimensions: originalDimensions,
    }
  }

  // Calculate target dimensions maintaining aspect ratio
  let targetWidth = img.naturalWidth
  let targetHeight = img.naturalHeight

  if (needsResize) {
    const ratio = Math.min(MAX_DIMENSION / img.naturalWidth, MAX_DIMENSION / img.naturalHeight)
    targetWidth = Math.round(img.naturalWidth * ratio)
    targetHeight = Math.round(img.naturalHeight * ratio)
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.')
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

  // Iteratively reduce quality until under size limit
  let quality = INITIAL_QUALITY
  let blob: Blob

  while (true) {
    blob = await canvasToBlob(canvas, quality)

    if (blob.size <= MAX_FILE_SIZE || quality <= MIN_QUALITY) {
      break
    }

    quality = Math.max(quality - QUALITY_STEP, MIN_QUALITY)
  }

  if (blob.size > MAX_FILE_SIZE) {
    throw new Error(
      `Ảnh vẫn quá lớn sau khi nén (${(blob.size / 1024 / 1024).toFixed(1)}MB). Vui lòng chọn ảnh có kích thước nhỏ hơn.`
    )
  }

  const compressedFile = new File(
    [blob],
    file.name.replace(/\.[^.]+$/, '.jpg'),
    { type: 'image/jpeg', lastModified: Date.now() }
  )

  return {
    file: compressedFile,
    wasCompressed: true,
    originalSize: file.size,
    compressedSize: compressedFile.size,
    originalDimensions,
    finalDimensions: { width: targetWidth, height: targetHeight },
  }
}
