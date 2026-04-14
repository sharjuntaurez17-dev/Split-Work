import { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export function CanvasRevealEffect({
  animationSpeed = 3,
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
  reverse = false,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animFrame
    const startTime = performance.now()

    function resize() {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
    }
    resize()
    window.addEventListener('resize', resize)

    const totalSize = 20
    const phi = 1.618033988

    function random(x, y) {
      return Math.abs(Math.sin(Math.sqrt(x * x + y * y) * phi) * 43758.5453) % 1
    }

    function draw() {
      const elapsed = (performance.now() - startTime) / 1000 * animationSpeed * 0.15
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      const cols = Math.ceil(w / totalSize)
      const rows = Math.ceil(h / totalSize)
      const centerX = cols / 2
      const centerY = rows / 2
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY)

      for (let gx = 0; gx < cols; gx++) {
        for (let gy = 0; gy < rows; gy++) {
          const seed = random(gx + 0.5, gy + 0.5)
          const colorIdx = Math.floor(seed * colors.length)
          const [r, g, b] = colors[colorIdx % colors.length]

          const dist = Math.sqrt((gx - centerX) ** 2 + (gy - centerY) ** 2)

          let timing
          if (reverse) {
            timing = (maxDist - dist) * 0.03 + seed * 0.3
          } else {
            timing = dist * 0.02 + seed * 0.2
          }

          let alpha
          if (reverse) {
            alpha = elapsed > timing ? 0 : Math.min(0.3 + seed * 0.7, 1)
          } else {
            alpha = elapsed > timing ? Math.min(0.3 + seed * 0.7, 1) : 0
          }

          // Twinkle effect
          const freq = 5
          const twinkle = Math.abs(Math.sin((elapsed + seed * 10) * freq * 0.3))
          alpha *= 0.5 + twinkle * 0.5

          if (alpha > 0.01) {
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
            ctx.fillRect(
              gx * totalSize + (totalSize - dotSize) / 2,
              gy * totalSize + (totalSize - dotSize) / 2,
              dotSize,
              dotSize
            )
          }
        }
      }

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [animationSpeed, colors, dotSize, reverse])

  return (
    <div className={cn('h-full relative w-full', containerClassName)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  )
}
