import { useRef, useEffect, useCallback } from 'react'
import { easeOutCubic, indexAtPointer, normalizeAngle, secureRandom, spinTarget, TAU } from '../lib/wheel'

// Color palette for wheel sectors (one per possible entry)
const COLORS = [
    '#7c3aed', '#f59e0b', '#ec4899', '#10b981',
    '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
    '#f97316', '#06b6d4', '#e11d48', '#84cc16',
]

const LABEL_FONT_FAMILY = 'Outfit, sans-serif'
const SPIN = { durationMs: 6000, turns: 5 }
const REDUCED_MOTION_SPIN = { durationMs: 1200, turns: 1 }

const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export default function Wheel({ entries, isSpinning, onSpinEnd }) {
    const canvasRef = useRef(null)
    const rotationRef = useRef(0)
    const sizeRef = useRef(0)
    const colorMapRef = useRef(new Map()) // name -> color index
    const labelsRef = useRef({ font: '', labels: [] })

    // Size the canvas buffer and precompute colors and labels; runs when entries, size or fonts change
    const layout = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const size = canvas.clientWidth
        const pixels = Math.round(size * (window.devicePixelRatio || 1))
        if (canvas.width !== pixels) {
            canvas.width = pixels
            canvas.height = pixels
        }
        sizeRef.current = size

        // Give each entry a color no other current entry is using
        const colorMap = colorMapRef.current
        for (const name of colorMap.keys()) {
            if (!entries.includes(name)) colorMap.delete(name)
        }
        const used = new Set(colorMap.values())
        for (const name of entries) {
            if (colorMap.has(name)) continue
            let index = 0
            while (used.has(index) && index < COLORS.length) index++
            index %= COLORS.length
            colorMap.set(name, index)
            used.add(index)
        }

        // Truncate labels to fit their sector
        const ctx = canvas.getContext('2d')
        const radius = size / 2 - 4
        const fontSize = Math.max(11, Math.min(16, 180 / Math.max(entries.length, 1)))
        const font = `600 ${fontSize}px ${LABEL_FONT_FAMILY}`
        ctx.font = font
        const maxWidth = radius * 0.65
        const labels = entries.map((entry) => {
            if (ctx.measureText(entry).width <= maxWidth) return entry
            const chars = Array.from(entry)
            while (chars.length > 1 && ctx.measureText(chars.join('') + '…').width > maxWidth) {
                chars.pop()
            }
            return chars.join('') + '…'
        })
        labelsRef.current = { font, labels }
    }, [entries])

    const paint = useCallback((rot) => {
        const canvas = canvasRef.current
        const size = sizeRef.current
        if (!canvas || !size) return
        const ctx = canvas.getContext('2d')
        const dpr = canvas.width / size
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const cx = size / 2
        const cy = size / 2
        const radius = size / 2 - 4

        ctx.clearRect(0, 0, size, size)

        if (entries.length === 0) {
            // Empty state
            ctx.beginPath()
            ctx.arc(cx, cy, radius, 0, TAU)
            ctx.fillStyle = 'rgba(55, 48, 107, 0.5)'
            ctx.fill()
            ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'
            ctx.lineWidth = 2
            ctx.stroke()
            return
        }

        const { font, labels } = labelsRef.current
        const sliceAngle = TAU / entries.length
        // Start drawing from the top (-π/2) so sectors align with the pointer
        const startOffset = rot - Math.PI / 2

        entries.forEach((entry, i) => {
            const start = startOffset + i * sliceAngle
            const end = start + sliceAngle

            // Sector
            ctx.beginPath()
            ctx.moveTo(cx, cy)
            ctx.arc(cx, cy, radius, start, end)
            ctx.closePath()
            ctx.fillStyle = COLORS[colorMapRef.current.get(entry) ?? 0]
            ctx.fill()

            // Border between sectors
            ctx.strokeStyle = 'rgba(0,0,0,0.2)'
            ctx.lineWidth = 1.5
            ctx.stroke()

            // Label
            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(start + sliceAngle / 2)
            ctx.textAlign = 'right'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = '#fff'
            ctx.font = font
            ctx.shadowColor = 'rgba(0,0,0,0.5)'
            ctx.shadowBlur = 3
            ctx.fillText(labels[i] ?? entry, radius - 14, 0)
            ctx.restore()
        })

        // Center circle
        ctx.beginPath()
        ctx.arc(cx, cy, radius * 0.13, 0, TAU)
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.13)
        gradient.addColorStop(0, '#1e1b4b')
        gradient.addColorStop(1, '#312e81')
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.6)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Outer ring glow
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, TAU)
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'
        ctx.lineWidth = 3
        ctx.stroke()
    }, [entries])

    // Spin animation: time-based easing towards a uniformly random landing angle
    useEffect(() => {
        if (!isSpinning) return

        const { durationMs, turns } = prefersReducedMotion() ? REDUCED_MOTION_SPIN : SPIN
        const from = rotationRef.current
        const target = spinTarget(from, turns, secureRandom())
        let startTime = null
        let frame

        const animate = (time) => {
            startTime ??= time
            const progress = Math.min(1, (time - startTime) / durationMs)
            rotationRef.current = from + (target - from) * easeOutCubic(progress)
            paint(rotationRef.current)

            if (progress < 1) {
                frame = requestAnimationFrame(animate)
            } else {
                rotationRef.current = normalizeAngle(target)
                onSpinEnd(entries[indexAtPointer(target, entries.length)])
            }
        }

        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [isSpinning, entries, paint, onSpinEnd])

    // Redraw when entries change, and again once the label font has loaded
    useEffect(() => {
        let cancelled = false
        const redraw = () => {
            if (cancelled) return
            layout()
            paint(rotationRef.current)
        }
        redraw()
        document.fonts?.load(`600 16px ${LABEL_FONT_FAMILY}`).then(redraw, () => {})
        return () => {
            cancelled = true
        }
    }, [layout, paint])

    // Redraw when the canvas changes size
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || typeof ResizeObserver === 'undefined') return
        const observer = new ResizeObserver(() => {
            layout()
            paint(rotationRef.current)
        })
        observer.observe(canvas)
        return () => observer.disconnect()
    }, [layout, paint])

    const label = entries.length > 0
        ? `Wheel with ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}: ${entries.join(', ')}`
        : 'Empty wheel. Add entries to get started.'

    return (
        <div className="relative flex items-center justify-center">
            {/* Pointer triangle at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 wheel-pointer" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 28 28">
                    <polygon points="14,24 3,4 25,4" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
                </svg>
            </div>
            <canvas
                ref={canvasRef}
                className="w-full aspect-square max-w-[340px] rounded-full"
                role="img"
                aria-label={label}
            />
        </div>
    )
}
