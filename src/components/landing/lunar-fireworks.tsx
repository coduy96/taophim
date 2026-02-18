"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const STORAGE_KEY = "taophim_fireworks_enabled"

// Refined palette — champagne golds, soft whites, delicate reds
const PALETTES = [
  ["#FFE4A0", "#FFF8E1", "#FFFFFF"], // champagne
  ["#FFD700", "#FFEAB0", "#FFFFFF"], // gold shimmer
  ["#FF8A80", "#FFCDD2", "#FFFFFF"], // soft rose
  ["#FFD700", "#FF8A80", "#FFFFFF"], // gold-rose
  ["#FFFFFF", "#FFE4A0", "#FFD700"], // white-gold
]

const MAX_PARTICLES = 2500
const GRAVITY = 0.06
const MAX_SIMULTANEOUS = 3
const MIN_INTERVAL = 800
const MAX_INTERVAL = 2200

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
  friction: number
  sparkle: boolean
}

interface Firework {
  x: number
  y: number
  targetY: number
  vy: number
  color: string
  palette: string[]
  exploded: boolean
  trail: { x: number; y: number }[]
}

type BurstType =
  | "dahlia"
  | "willow"
  | "crossette"
  | "kamuro"
  | "pistil"
  | "peony"
  | "brocade"
  | "spider"
  | "horsetail"
  | "palm"
  | "strobe"
  | "comet"

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

    const bursts: BurstType[] = [
      "dahlia",
      "willow",
      "crossette",
      "kamuro",
      "pistil",
      "peony",
      "brocade",
      "spider",
      "horsetail",
      "palm",
      "strobe",
      "comet",
    ]
    const pickBurst = () => bursts[Math.floor(Math.random() * bursts.length)]

    const launchFirework = () => {
      const palette = pickPalette()
      fireworksRef.current.push({
        x: W() * (0.15 + Math.random() * 0.7),
        y: H(),
        targetY: H() * (0.12 + Math.random() * 0.38),
        vy: -(9 + Math.random() * 4),
        color: palette[0],
        palette,
        exploded: false,
        trail: [],
      })
    }

    const makeParticle = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      color: string,
      opts?: Partial<Particle>
    ): Particle => ({
      x,
      y,
      vx,
      vy,
      alpha: 1,
      decay: 0.006,
      color,
      size: 0.8,
      trail: [],
      friction: 0.985,
      sparkle: false,
      ...opts,
    })

    const explode = (fw: Firework, burst: BurstType) => {
      const budget = MAX_PARTICLES - particlesRef.current.length
      if (budget <= 0) return
      const pick = () =>
        fw.palette[Math.floor(Math.random() * fw.palette.length)]

      switch (burst) {
        case "dahlia": {
          // Elegant thin rays
          const count = Math.min(80, budget)
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count
            const speed = 1.5 + Math.random() * 3.5
            particlesRef.current.push(
              makeParticle(
                fw.x,
                fw.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                pick(),
                {
                  decay: 0.004 + Math.random() * 0.005,
                  size: 0.6 + Math.random() * 0.6,
                  friction: 0.988,
                  sparkle: Math.random() < 0.25,
                }
              )
            )
          }
          break
        }
        case "willow": {
          // Long drooping golden strands
          const count = Math.min(60, budget)
          for (let i = 0; i < count; i++) {
            const angle =
              (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15
            const speed = 1 + Math.random() * 2.5
            particlesRef.current.push(
              makeParticle(
                fw.x,
                fw.y,
                Math.cos(angle) * speed * 0.6,
                Math.sin(angle) * speed,
                pick(),
                {
                  decay: 0.002 + Math.random() * 0.003,
                  size: 0.5 + Math.random() * 0.5,
                  friction: 0.995,
                  sparkle: false,
                }
              )
            )
          }
          break
        }
        case "crossette": {
          // Splits into thin crossing lines
          const arms = 6 + Math.floor(Math.random() * 4)
          const perArm = Math.min(Math.floor(50 / arms), Math.floor(budget / arms))
          for (let a = 0; a < arms; a++) {
            const baseAngle = (Math.PI * 2 * a) / arms
            for (let i = 0; i < perArm; i++) {
              const spread = (Math.random() - 0.5) * 0.12
              const speed = 2 + Math.random() * 3
              particlesRef.current.push(
                makeParticle(
                  fw.x,
                  fw.y,
                  Math.cos(baseAngle + spread) * speed,
                  Math.sin(baseAngle + spread) * speed,
                  pick(),
                  {
                    decay: 0.005 + Math.random() * 0.006,
                    size: 0.5 + Math.random() * 0.5,
                    friction: 0.982,
                    sparkle: Math.random() < 0.4,
                  }
                )
              )
            }
          }
          break
        }
        case "kamuro": {
          // Dense crown that lingers
          const count = Math.min(100, budget)
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count
            const speed = 0.8 + Math.random() * 2.8
            particlesRef.current.push(
              makeParticle(
                fw.x,
                fw.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                pick(),
                {
                  decay: 0.002 + Math.random() * 0.004,
                  size: 0.4 + Math.random() * 0.6,
                  friction: 0.992,
                  sparkle: Math.random() < 0.5,
                }
              )
            )
          }
          break
        }
        case "pistil": {
          // Outer ring + bright inner core
          const outer = Math.min(55, Math.floor(budget * 0.7))
          for (let i = 0; i < outer; i++) {
            const angle = (Math.PI * 2 * i) / outer
            const speed = 2 + Math.random() * 3
            particlesRef.current.push(
              makeParticle(
                fw.x,
                fw.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                pick(),
                {
                  decay: 0.005 + Math.random() * 0.006,
                  size: 0.6 + Math.random() * 0.5,
                  friction: 0.984,
                }
              )
            )
          }
          // Bright inner core
          const inner = Math.min(20, budget - outer)
          for (let i = 0; i < inner; i++) {
            const angle = (Math.PI * 2 * i) / inner
            const speed = 0.5 + Math.random() * 1.2
            particlesRef.current.push(
              makeParticle(fw.x, fw.y, Math.cos(angle) * speed, Math.sin(angle) * speed, "#FFFFFF", {
                decay: 0.008 + Math.random() * 0.006,
                size: 1 + Math.random() * 0.5,
                friction: 0.98,
                sparkle: true,
              })
            )
          }
          break
        }
        case "peony": {
          // Full lush sphere — two layers for depth
          const outerCount = Math.min(65, Math.floor(budget * 0.65))
          for (let i = 0; i < outerCount; i++) {
            const angle = (Math.PI * 2 * i) / outerCount + (Math.random() - 0.5) * 0.25
            const speed = 2.5 + Math.random() * 3
            particlesRef.current.push(
              makeParticle(fw.x, fw.y, Math.cos(angle) * speed, Math.sin(angle) * speed, pick(), {
                decay: 0.005 + Math.random() * 0.005,
                size: 0.7 + Math.random() * 0.6,
                friction: 0.986,
                sparkle: Math.random() < 0.2,
              })
            )
          }
          const innerCount = Math.min(30, budget - outerCount)
          for (let i = 0; i < innerCount; i++) {
            const angle = (Math.PI * 2 * i) / innerCount
            const speed = 1 + Math.random() * 1.8
            particlesRef.current.push(
              makeParticle(fw.x, fw.y, Math.cos(angle) * speed, Math.sin(angle) * speed, "#FFFFFF", {
                decay: 0.007 + Math.random() * 0.005,
                size: 0.5 + Math.random() * 0.4,
                friction: 0.99,
                sparkle: true,
              })
            )
          }
          break
        }
        case "brocade": {
          // Dense golden cascade — slow heavy fall
          const count = Math.min(85, budget)
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2
            const speed = 1.5 + Math.random() * 3
            particlesRef.current.push(
              makeParticle(fw.x, fw.y, Math.cos(angle) * speed, Math.sin(angle) * speed, pick(), {
                decay: 0.002 + Math.random() * 0.002,
                size: 0.4 + Math.random() * 0.4,
                friction: 0.997,
                sparkle: Math.random() < 0.6,
              })
            )
          }
          break
        }
        case "spider": {
          // Long thin tendrils that crawl outward
          const tendrils = 8 + Math.floor(Math.random() * 6)
          const perTendril = Math.min(Math.floor(70 / tendrils), Math.floor(budget / tendrils))
          for (let t = 0; t < tendrils; t++) {
            const baseAngle = (Math.PI * 2 * t) / tendrils + (Math.random() - 0.5) * 0.1
            for (let i = 0; i < perTendril; i++) {
              const speedMult = 0.3 + (i / perTendril) * 0.7
              const speed = (3 + Math.random() * 3.5) * speedMult
              const wobble = (Math.random() - 0.5) * 0.06
              particlesRef.current.push(
                makeParticle(
                  fw.x, fw.y,
                  Math.cos(baseAngle + wobble) * speed,
                  Math.sin(baseAngle + wobble) * speed,
                  pick(),
                  {
                    decay: 0.003 + Math.random() * 0.004,
                    size: 0.4 + Math.random() * 0.4,
                    friction: 0.991,
                    sparkle: i === perTendril - 1,
                  }
                )
              )
            }
          }
          break
        }
        case "horsetail": {
          // Dense upward spray that cascades down like a fountain
          const count = Math.min(75, budget)
          for (let i = 0; i < count; i++) {
            const spread = (Math.random() - 0.5) * Math.PI * 0.6
            const angle = -Math.PI / 2 + spread
            const speed = 2 + Math.random() * 4
            particlesRef.current.push(
              makeParticle(fw.x, fw.y, Math.cos(angle) * speed * 0.5, Math.sin(angle) * speed, pick(), {
                decay: 0.002 + Math.random() * 0.003,
                size: 0.5 + Math.random() * 0.5,
                friction: 0.996,
                sparkle: Math.random() < 0.3,
              })
            )
          }
          break
        }
        case "palm": {
          // Upward arcing fronds that curve and fall
          const fronds = 5 + Math.floor(Math.random() * 4)
          const perFrond = Math.min(Math.floor(60 / fronds), Math.floor(budget / fronds))
          for (let f = 0; f < fronds; f++) {
            const baseAngle = -Math.PI / 2 + ((f / (fronds - 1)) - 0.5) * Math.PI * 0.8
            for (let i = 0; i < perFrond; i++) {
              const t = i / perFrond
              const speed = 2 + t * 4
              const wobble = (Math.random() - 0.5) * 0.08
              particlesRef.current.push(
                makeParticle(
                  fw.x, fw.y,
                  Math.cos(baseAngle + wobble) * speed,
                  Math.sin(baseAngle + wobble) * speed,
                  pick(),
                  {
                    decay: 0.003 + Math.random() * 0.004,
                    size: 0.5 + Math.random() * 0.5,
                    friction: 0.988,
                    sparkle: false,
                  }
                )
              )
            }
          }
          break
        }
        case "strobe": {
          // Ring of intensely flickering sparkle particles
          const count = Math.min(60, budget)
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count
            const speed = 2 + Math.random() * 3.5
            particlesRef.current.push(
              makeParticle(fw.x, fw.y, Math.cos(angle) * speed, Math.sin(angle) * speed, pick(), {
                decay: 0.006 + Math.random() * 0.006,
                size: 0.8 + Math.random() * 0.8,
                friction: 0.98,
                sparkle: true,
              })
            )
          }
          break
        }
        case "comet": {
          // Few bright streaks that shoot outward with long tails
          const count = Math.min(12, budget)
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
            const speed = 4 + Math.random() * 3
            particlesRef.current.push(
              makeParticle(fw.x, fw.y, Math.cos(angle) * speed, Math.sin(angle) * speed, "#FFFFFF", {
                decay: 0.003 + Math.random() * 0.003,
                size: 1 + Math.random() * 0.5,
                friction: 0.992,
                sparkle: true,
              })
            )
          }
          // Scatter fill between comets
          const fill = Math.min(45, budget - count)
          for (let i = 0; i < fill; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 1 + Math.random() * 2.5
            particlesRef.current.push(
              makeParticle(fw.x, fw.y, Math.cos(angle) * speed, Math.sin(angle) * speed, pick(), {
                decay: 0.005 + Math.random() * 0.006,
                size: 0.4 + Math.random() * 0.3,
                friction: 0.986,
                sparkle: Math.random() < 0.3,
              })
            )
          }
          break
        }
      }
    }

    let running = true

    const loop = (timestamp: number) => {
      if (!running) return

      // Fade previous frame — creates elegant trailing afterglow
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = "rgba(0,0,0,0.08)"
      ctx.fillRect(0, 0, W(), H())
      ctx.globalCompositeOperation = "lighter"

      if (enabledRef.current) {
        const rising = fireworksRef.current.filter((f) => !f.exploded).length
        if (
          timestamp - lastLaunchRef.current > nextIntervalRef.current &&
          rising < MAX_SIMULTANEOUS
        ) {
          launchFirework()
          lastLaunchRef.current = timestamp
          nextIntervalRef.current = randomInterval()
        }

        // Rising fireworks — thin elegant trail
        fireworksRef.current = fireworksRef.current.filter((fw) => {
          if (fw.exploded) return false

          fw.trail.push({ x: fw.x, y: fw.y })
          if (fw.trail.length > 18) fw.trail.shift()

          fw.y += fw.vy
          fw.vy += 0.05
          fw.x += Math.sin(fw.y * 0.04) * 0.2

          // Draw thin trailing line
          if (fw.trail.length > 1) {
            for (let i = 1; i < fw.trail.length; i++) {
              const a = (i / fw.trail.length) * 0.5
              ctx.globalAlpha = a
              ctx.strokeStyle = fw.color
              ctx.lineWidth = 0.8
              ctx.beginPath()
              ctx.moveTo(fw.trail[i - 1].x, fw.trail[i - 1].y)
              ctx.lineTo(fw.trail[i].x, fw.trail[i].y)
              ctx.stroke()
            }
          }

          // Bright head — tiny radial glow
          ctx.globalAlpha = 0.9
          const g = ctx.createRadialGradient(fw.x, fw.y, 0, fw.x, fw.y, 5)
          g.addColorStop(0, "#FFFFFF")
          g.addColorStop(0.5, fw.color + "90")
          g.addColorStop(1, "transparent")
          ctx.beginPath()
          ctx.arc(fw.x, fw.y, 5, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()

          if (fw.y <= fw.targetY) {
            fw.exploded = true
            explode(fw, pickBurst())
            return false
          }
          return true
        })

        // Particles — thin lines + tiny dots
        particlesRef.current = particlesRef.current.filter((p) => {
          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 10) p.trail.shift()

          p.x += p.vx
          p.y += p.vy
          p.vy += GRAVITY
          p.vx *= p.friction
          p.vy *= p.friction
          p.alpha -= p.decay

          if (p.alpha <= 0) return false

          // Draw trail as thin connected line
          if (p.trail.length > 1) {
            ctx.strokeStyle = p.color
            ctx.lineWidth = p.size * 0.6
            ctx.lineCap = "round"
            ctx.beginPath()
            ctx.moveTo(p.trail[0].x, p.trail[0].y)
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y)
            }
            ctx.lineTo(p.x, p.y)
            ctx.globalAlpha = p.alpha * 0.35
            ctx.stroke()
          }

          // Sparkle shimmer
          const flicker = p.sparkle
            ? 0.4 + Math.abs(Math.sin(timestamp * 0.015 + p.x * 0.5)) * 0.6
            : 1

          // Soft glow around particle
          ctx.globalAlpha = p.alpha * flicker * 0.15
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()

          // Particle dot
          ctx.globalAlpha = p.alpha * flicker
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()

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
          className="fixed bottom-4 left-4 z-[51] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: enabled
              ? "linear-gradient(135deg, #FFD700, #FF8A80)"
              : "rgba(120, 120, 120, 0.5)",
            boxShadow: enabled
              ? "0 2px 20px rgba(255, 215, 0, 0.3)"
              : "0 2px 10px rgba(0,0,0,0.15)",
          }}
          aria-label={enabled ? "Tắt pháo hoa" : "Bật pháo hoa"}
          title={enabled ? "Tắt pháo hoa" : "Bật pháo hoa"}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            {enabled ? (
              <circle cx="12" cy="12" r="2.5" fill="white" stroke="none" />
            ) : (
              <>
                <circle cx="12" cy="12" r="2.5" />
                <line x1="4" y1="4" x2="20" y2="20" strokeWidth="2" />
              </>
            )}
          </svg>
        </button>
      )}
    </>
  )
}
