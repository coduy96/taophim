"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

// YouTube channel: https://www.youtube.com/@TạoPhimAI
// Video IDs extracted from YouTube Shorts URLs
const demoVideos = [
  { id: "K4tM39_BgEc" },
  { id: "GTwlIakB0zE" },
  { id: "YN4ddGwGufY" },
  { id: "Q62iHZVdAAQ" },
  { id: "uyYvCTVl3_k" },
  { id: "Y31jA6MNMTw" },
  { id: "Q370ZNFexH0" },
  { id: "ZjRi1JVDl48" },
  { id: "McEacq1XfCk" },
  { id: "k8Snx2MfHvU" },
  { id: "gPgBpfp2kNc" },
  { id: "0yD-XY84jFo" },
  { id: "cME6tehP9gA" },
  { id: "iZoOwOHMOU0" },
  { id: "rcWm-yqs4aE" },
]

// Play icon for video overlay
const PlayCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
)

// YouTube icon
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

// Close icon
const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

interface VideoCardProps {
  videoId: string
  isPlaying: boolean
  onPlay: () => void
  onStop: () => void
}

function VideoCard({ videoId, isPlaying, onPlay, onStop }: VideoCardProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 shadow-xl hover:ring-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
      {/* Shorts Container - 9:16 aspect ratio */}
      <div className="aspect-[9/16] relative bg-zinc-900 max-h-[500px]">
        {isPlaying ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title="Video Demo Tạo Phim AI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            {/* Close button */}
            <button
              onClick={onStop}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/70 hover:bg-black flex items-center justify-center transition-colors"
              aria-label="Đóng video"
            >
              <CloseIcon className="w-4 h-4 text-white" />
            </button>
          </>
        ) : (
          <>
            {/* YouTube Thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/oar2.jpg`}
              alt="Video Demo Tạo Phim AI"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback to default thumbnail
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            {/* Play Button */}
            <button
              onClick={onPlay}
              className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
              aria-label="Phát video"
            >
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl shadow-primary/50 group-hover/play:scale-110 group-hover/play:bg-primary transition-all duration-300">
                <PlayCircleIcon className="w-8 h-8 text-white ml-0.5" />
              </div>
            </button>

            {/* Shorts Badge */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-red-500/90 rounded-md flex items-center gap-1.5 shadow-lg">
              <YoutubeIcon className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">Shorts</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function VideoDemosSection() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Auto-advance carousel every 5 seconds - ONLY when no video is playing
  React.useEffect(() => {
    if (!api || playingVideoId) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [api, playingVideoId])

  // Calculate total "pages" for dots (showing 4 items per page on desktop)
  const totalPages = Math.ceil(demoVideos.length / 4)

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-sm font-medium text-red-500 mb-6">
            <YoutubeIcon className="w-4 h-4" />
            Video Demo Thực Tế
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Xem <span className="text-primary">Kết Quả Thực Tế</span> Từ Taophim
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Không chỉ lời nói, đây là những video thật được tạo bởi AI.
            <br />
            <span className="text-foreground font-medium">Chất lượng điện ảnh, chi tiết sắc nét.</span>
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {demoVideos.map((video, index) => (
                <CarouselItem
                  key={video.id}
                  className="pl-3 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
                >
                  <VideoCard
                    videoId={video.id}
                    isPlaying={playingVideoId === video.id}
                    onPlay={() => {
                      setPlayingVideoId(video.id)
                      api?.scrollTo(index)
                    }}
                    onStop={() => setPlayingVideoId(null)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 w-12 h-12" />
            <CarouselNext className="hidden md:flex -right-12 w-12 h-12" />
          </Carousel>

          {/* Dots Indicator - simplified for mobile */}
          <div className="flex justify-center gap-1.5 mt-8">
            {Array.from({ length: Math.min(totalPages, 8) }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index * 4)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  Math.floor(current / 4) === index
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Đi đến trang ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
