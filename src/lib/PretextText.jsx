import { useEffect, useRef, useState, useMemo } from 'react'

// Lazy-import the pretext library to avoid errors if canvas is not ready
let pretextModule = null
let pretextLoading = false
let pretextCallbacks = []

function loadPretext() {
  if (pretextModule) return Promise.resolve(pretextModule)
  if (pretextLoading) return new Promise(resolve => pretextCallbacks.push(resolve))
  pretextLoading = true
  return import('./pretext/layout.ts').then(mod => {
    pretextModule = mod
    pretextCallbacks.forEach(cb => cb(mod))
    pretextCallbacks = []
    return mod
  }).catch(() => {
    pretextLoading = false
    return null
  })
}

/**
 * PretextText — wraps text content and uses the @chenglou/pretext library
 * to pre-measure how many lines the text will take at the current container
 * width, then sets a minHeight so the layout never collapses or jumps.
 *
 * Props:
 *   text        — the string to measure
 *   font        — CSS font string, e.g. "16px DM Sans" (default: "15px DM Sans")
 *   lineHeight  — line height multiplier (default: 1.5)
 *   className   — Tailwind / CSS classes to put on the container div
 *   style       — extra inline styles
 *   children    — if provided, renders children instead of text
 */
export default function PretextText({
  text = '',
  font = '15px DM Sans',
  lineHeight = 1.5,
  className = '',
  style = {},
  children,
}) {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [mod, setMod] = useState(null)

  // Load the pretext module once
  useEffect(() => {
    loadPretext().then(m => setMod(m))
  }, [])

  // Track container width via ResizeObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width)
    })
    ro.observe(el)
    setContainerWidth(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  // Memoize prepare() — only re-runs when text or font changes
  const prepared = useMemo(() => {
    if (!mod || !text) return null
    try {
      return mod.prepare(text, font)
    } catch {
      return null
    }
  }, [mod, text, font])

  // Compute height using layout()
  const computedHeight = useMemo(() => {
    if (!prepared || containerWidth <= 0) return null
    const fontSize = parseFloat(font) || 15
    const lineHeightPx = fontSize * lineHeight
    try {
      const result = mod.layout(prepared, containerWidth, lineHeightPx)
      return result.height
    } catch {
      return null
    }
  }, [prepared, containerWidth, lineHeight, font, mod])

  return (
    <div
      ref={containerRef}
      className={className}
      style={computedHeight ? { minHeight: computedHeight, ...style } : style}
    >
      {children ?? text}
    </div>
  )
}
