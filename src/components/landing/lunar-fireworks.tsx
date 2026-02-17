"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const STORAGE_KEY = "taophim_fireworks_enabled"

// Lunar New Year palette — rich golds, reds, warm tones + white sparkle
const PALETTES = [
  ["#FFD700", "#FFEC80", "#FFA500"], // gold burst
  ["#FF4444", "#FF6B6B", "#FF8A80"], // red burst
  ["#FF6B6B", "#FFA500", "#FFD700"], // coral-to-gold
  ["#FFC107", "#FFD700", "#FFFFFF"], // amber sparkle
  ["#FF4444", "#FFD700", "#FFFFFF"], // red-gold classic
]

const MAX_PARTICLES = 3000
const GRAVITY = 0.12
const MAX_SIMULTANEOUS = 4
const MIN_INTERVAL = 600
const MAX_INTERVAL = 1800

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  decay: number
  color: string
  size: number
  trail: { x: number; y: number }[]
  twinkle: boolean
  friction: number
}

interface Firework {
  x: number
  y: number
  targetY: number
  vy: number
  color: string
  palette: string[]
  exploded: boolean
  trail: { x: number; y: number; alpha: number }[]
}

type BurstType = "peony" | "chrysanthemum" | "willow" | "ring" | "palm"

export function LunarFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const fireworksRef = useRef<Firework[]>([])
  const lastLaunchRef = useRef(0)
  const nextIntervalRef = useRef(0)
  const enabledRef = useRef(true)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) {
      setEnabled(false)
      enabledRef.current = false
      return
    }
    const saved = localStorage.getItem(STORAGE_KEY)
    const initial = saved !== "false"
    setEnabled(initial)
    enabledRef.current = initial
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      enabledRef.current = next
      localStorage.setItem(STORAGE_KEY, String(next))
      if (!next) {
        particlesRef.current = []
        fireworksRef.current = []
      }
      return next
    })
  }, [])

  // Canvas resize with DPR support
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
      const ctx = canvas.getContext("2d")
      if (ctx) ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  // Animation loop
  useEffect(() => {
    if (enabled === null) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = () => window.innerWidth
    const H = () => window.innerHeight

    const randomInterval = () =>
      MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)

    nextIntervalRef.current = randomInterval()

    const pickPalette = () =>
      PALETTES[Math.floor(Math.random() * PALETTES.length)]

    const burstTypes: BurstType[] = [
      "peony",
      "chrysanthemum",
      "willow",
      "ring",
      "palm",
    ]
    const pickBurst = () =>
      burstTypes[Math.floor(Math.random() * burstTypes.length)]

    const launchFirework = () => {
      const palette = pickPalette()
      fireworksRef.current.push({
        x: W() * (0.1 + Math.random() * 0.8),
        y: H(),
        targetY: H() * (0.15 + Math.random() * 0.45),
        vy: -(10 + Math.random() * 5),
        color: palette[0],
        palette,
        exploded: false,
        trail: [],
      })
    }

    const explode = (fw: Firework, burst: BurstType) => {
      const budget = MAX_PARTICLES - particlesRef.current.length
      if (budget <= 0) return

      const pickColor = () =>
        fw.palette[Math.floor(Math.random() * fw.palette.length)]

      switch (burst) {
        case "peony": {
          // Classic spherical burst
          const count = Math.min(70, budget)
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2
            const speed = 3 + Math.random() * 4
            particlesRef.current.push({
              x: fw.x,
              y: fw.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              decay: 0.008 + Math.random() * 0.01,
              color: pickColor(),
              size: 1.8 + Math.random() * 1.5,
              trail: [],
              twinkle: Math.random() < 0.3,
              friction: 0.985,
            })
          }
          break
        }
        case "chrysanthemum": {
          // Dense, long-trailing burst
          const count = Math.min(90, budget)
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15
            const speed = 2 + Math.random() * 5.5
            particlesRef.current.push({
              x: fw.x,
              y: fw.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              decay: 0.005 + Math.random() * 0.008,
              color: pickColor(),
              size: 1.5 + Math.random() * 1,
              trail: [],
              twinkle: Math.random() < 0.2,
              friction: 0.978,
            })
          }
          break
        }
        case "willow": {
          // Droopy, gravity-heavy
          const count = Math.min(60, budget)
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
            const speed = 2 + Math.random() * 3.5
            particlesRef.current.push({
              x: fw.x,
              y: fw.y,
              vx: Math.cos(angle) * speed * 0.7,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              decay: 0.004 + Math.random() * 0.006,
              color: pickColor(),
              size: 1.2 + Math.random() * 1.2,
              trail: [],
              twinkle: false,
              friction: 0.99,
            })
          }
          break
        }
        case "ring": {
          // Single ring outline
          const count = Math.min(50, budget)
          const ringSpeed = 4 + Math.random() * 2
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count
            particlesRef.current.push({
              x: fw.x,
              y: fw.y,
              vx: Math.cos(angle) * ringSpeed,
              vy: Math.sin(angle) * ringSpeed,
              alpha: 1,
              decay: 0.01 + Math.random() * 0.008,
              color: pickColor(),
              size: 2 + Math.random() * 1.5,
              trail: [],
              twinkle: Math.random() < 0.5,
              friction: 0.98,
            })
          }
          break
        }
        case "palm": {
          // Upward streaks that fall
          const count = Math.min(55, budget)
          for (let i = 0; i < count; i++) {
            const angle =
              -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2
            const speed = 3 + Math.random() * 5
            particlesRef.current.push({
              x: fw.x,
              y: fw.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              decay: 0.006 + Math.random() * 0.009,
              color: pickColor(),
              size: 1.5 + Math.random() * 2,
              trail: [],
              twinkle: Math.random() < 0.15,
              friction: 0.982,
            })
          }
          break
        }
      }
    }

    let running = true

    const loop = (timestamp: number) => {
      if (!running) return

      // Semi-transparent clear for subtle motion blur
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = "rgba(0,0,0,0.15)"
      ctx.fillRect(0, 0, W(), H())
      ctx.globalCompositeOperation = "lighter"

      if (enabledRef.current) {
        // Launch on interval
        const rising = fireworksRef.current.filter((f) => !f.exploded).length
        if (
          timestamp - lastLaunchRef.current > nextIntervalRef.current &&
          rising < MAX_SIMULTANEOUS
        ) {
          launchFirework()
          lastLaunchRef.current = timestamp
          nextIntervalRef.current = randomInterval()
        }

        // Update & draw rising fireworks
        fireworksRef.current = fireworksRef.current.filter((fw) => {
          if (fw.exploded) return false

          // Store trail
          fw.trail.push({ x: fw.x, y: fw.y, alpha: 0.8 })
          if (fw.trail.length > 12) fw.trail.shift()

          fw.y += fw.vy
          fw.vy += 0.06
          // Slight wobble
          fw.x += Math.sin(fw.y * 0.05) * 0.3

          // Draw trail
          for (let i = 0; i < fw.trail.length; i++) {
            const t = fw.trail[i]
            const a = (i / fw.trail.length) * 0.4
            ctx.globalAlpha = a
            ctx.beginPath()
            ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2)
            ctx.fillStyle = fw.color
            ctx.fill()
          }

          // Draw head with glow
          ctx.globalAlpha = 1
          const grad = ctx.createRadialGradient(
            fw.x, fw.y, 0, fw.x, fw.y, 8
          )
          grad.addColorStop(0, fw.color)
          grad.addColorStop(0.4, fw.color + "80")
          grad.addColorStop(1, "transparent")
          ctx.beginPath()
          ctx.arc(fw.x, fw.y, 8, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()

          // Bright core
          ctx.beginPath()
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = "#FFFFFF"
          ctx.fill()

          if (fw.y <= fw.targetY) {
            fw.exploded = true
            explode(fw, pickBurst())
            return false
          }
          return true
        })

        // Update & draw particles
        particlesRef.current = particlesRef.current.filter((p) => {
          // Store trail position
          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 6) p.trail.shift()

          p.x += p.vx
          p.y += p.vy
          p.vy += GRAVITY
          p.vx *= p.friction
          p.vy *= p.friction
          p.alpha -= p.decay

          if (p.alpha <= 0) return false

          // Draw trail
          for (let i = 0; i < p.trail.length; i++) {
            const t = p.trail[i]
            const a = (i / p.trail.length) * p.alpha * 0.3
            ctx.globalAlpha = a
            ctx.beginPath()
            ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.fill()
          }

          // Twinkle effect
          const flicker = p.twinkle
            ? 0.5 + Math.sin(timestamp * 0.02 + p.x) * 0.5
            : 1

          // Particle glow
          ctx.globalAlpha = p.alpha * flicker * 0.3
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()

          // Particle core
          ctx.globalAlpha = p.alpha * flicker
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()

          // Bright white center on larger particles
          if (p.size > 2 && p.alpha > 0.5) {
            ctx.globalAlpha = p.alpha * flicker * 0.8
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2)
            ctx.fillStyle = "#FFFFFF"
            ctx.fill()
          }

          return true
        })

        ctx.globalAlpha = 1
      }

      ctx.globalCompositeOperation = "source-over"
      animFrameRef.current = requestAnimationFrame(loop)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameRef.current)
      } else {
        // Clear stale state on return
        particlesRef.current = []
        fireworksRef.current = []
        animFrameRef.current = requestAnimationFrame(loop)
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [enabled])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
        aria-hidden="true"
      />

      {enabled !== null && (
        <button
          onClick={toggle}
          className="fixed bottom-4 left-4 z-[51] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl"
          style={{
            background: enabled
              ? "linear-gradient(135deg, #FFD700, #FF4444)"
              : "rgba(100, 100, 100, 0.6)",
          }}
          aria-label={enabled ? "Tắt pháo hoa" : "Bật pháo hoa"}
          title={enabled ? "Tắt pháo hoa" : "Bật pháo hoa"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            {enabled ? (
              <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
            ) : (
              <>
                <circle cx="12" cy="12" r="3" />
                <line x1="4" y1="4" x2="20" y2="20" strokeWidth="2.5" />
              </>
            )}
          </svg>
        </button>
      )}
    </>
  )
}
