import { useRef, useEffect, useCallback } from 'react'

// Color palette for wheel sectors
const COLORS = [
    '#7c3aed', '#f59e0b', '#ec4899', '#10b981',
    '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
    '#f97316', '#06b6d4', '#e11d48', '#84cc16',
]

export default function Wheel({ entries, isSpinning, rotation, onSpinEnd }) {
    const canvasRef = useRef(null)
    const animRef = useRef(null)
    const velocityRef = useRef(0)
    const currentRotRef = useRef(rotation || 0)
    const colorMapRef = useRef(new Map()) // name -> color index
    const nextColorRef = useRef(0)

    // Assign unique colors: each new name gets the next color in sequence
    const getColor = useCallback((name) => {
        if (!colorMapRef.current.has(name)) {
            colorMapRef.current.set(name, nextColorRef.current % COLORS.length)
            nextColorRef.current++
        }
        return COLORS[colorMapRef.current.get(name)]
    }, [])

    // Draw the wheel
    const draw = useCallback((rot) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        const size = canvas.clientWidth
        canvas.width = size * dpr
        canvas.height = size * dpr
        ctx.scale(dpr, dpr)

        const cx = size / 2
        const cy = size / 2
        const radius = size / 2 - 4

        ctx.clearRect(0, 0, size, size)

        if (entries.length === 0) {
            // Empty state
            ctx.beginPath()
            ctx.arc(cx, cy, radius, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(55, 48, 107, 0.5)'
            ctx.fill()
            ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'
            ctx.lineWidth = 2
            ctx.stroke()
            return
        }

        const sliceAngle = (Math.PI * 2) / entries.length
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
            ctx.fillStyle = getColor(entry)
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
            ctx.font = `600 ${Math.max(11, Math.min(16, 180 / entries.length))}px Outfit`
            ctx.shadowColor = 'rgba(0,0,0,0.5)'
            ctx.shadowBlur = 3

            // Truncate long names
            let label = entry
            const maxWidth = radius * 0.65
            while (ctx.measureText(label).width > maxWidth && label.length > 1) {
                label = label.slice(0, -1)
            }
            if (label !== entry) label += '…'

            ctx.fillText(label, radius - 14, 0)
            ctx.restore()
        })

        // Center circle
        ctx.beginPath()
        ctx.arc(cx, cy, radius * 0.13, 0, Math.PI * 2)
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
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'
        ctx.lineWidth = 3
        ctx.stroke()
    }, [entries, getColor])

    // Spin animation
    useEffect(() => {
        if (!isSpinning) return

        // Random velocity between 20-35 rad/s
        const initialVelocity = 20 + Math.random() * 15
        velocityRef.current = initialVelocity

        const deceleration = 0.99 // Friction coefficient (lower = faster stop)
        const minVelocity = 0.01
        let lastTime = performance.now()

        const animate = (time) => {
            const delta = (time - lastTime) / 1000
            lastTime = time

            velocityRef.current *= deceleration
            currentRotRef.current += velocityRef.current * delta

            draw(currentRotRef.current)

            if (velocityRef.current > minVelocity) {
                animRef.current = requestAnimationFrame(animate)
            } else {
                // Determine which entry the pointer lands on
                // Pointer is at angle -π/2 (top). Sectors are drawn starting at (rot - π/2).
                // Sector i spans from (rot - π/2 + i*sliceAngle) to (rot - π/2 + (i+1)*sliceAngle).
                // The pointer at -π/2 is in sector i when:
                //   rot + i*sliceAngle ≡ 0 (mod 2π), i.e. i = (-rot / sliceAngle) mod N
                const sliceAngle = (Math.PI * 2) / entries.length
                const normalizedRot = ((currentRotRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
                const winnerIndex = Math.floor(((Math.PI * 2 - normalizedRot) % (Math.PI * 2)) / sliceAngle) % entries.length
                onSpinEnd(entries[winnerIndex])
            }
        }

        animRef.current = requestAnimationFrame(animate)

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [isSpinning, entries, draw, onSpinEnd])

    // Initial draw / redraw when entries change
    useEffect(() => {
        draw(currentRotRef.current)
    }, [entries, draw])

    // Redraw on resize (debounced to avoid flicker)
    useEffect(() => {
        let timeout
        const handleResize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(() => draw(currentRotRef.current), 50)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            clearTimeout(timeout)
            window.removeEventListener('resize', handleResize)
        }
    }, [draw])

    return (
        <div className="relative flex items-center justify-center"
            style={{ transition: 'width 0.3s ease, height 0.3s ease' }}>
            {/* Pointer triangle at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 wheel-pointer">
                <svg width="28" height="28" viewBox="0 0 28 28">
                    <polygon points="14,24 3,4 25,4" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
                </svg>
            </div>
            <canvas
                ref={canvasRef}
                className="w-full aspect-square max-w-[340px]"
                style={{ borderRadius: '50%', transition: 'width 0.3s ease, height 0.3s ease' }}
                role="img"
                aria-label="Spinning wheel animation"
            />
        </div>
    )
}
