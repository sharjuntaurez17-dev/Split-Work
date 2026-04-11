export default function SplitworkLogo({ size = 132 }) {
  return (
    <div className="rounded-[28px] bg-white/95 shadow-xl flex items-center justify-center p-1.5"
      style={{ width: size, height: size }}>
      <svg viewBox="0 0 512 512" className="w-full h-full rounded-[22px]" aria-label="Splitwork logo" role="img">
        <defs>
          <linearGradient id="topGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9EDFD1" />
            <stop offset="100%" stopColor="#A6DDD2" />
          </linearGradient>
          <linearGradient id="leftGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1EC9BE" />
            <stop offset="100%" stopColor="#0C7FD1" />
          </linearGradient>
          <linearGradient id="centerGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#23D0C2" />
            <stop offset="100%" stopColor="#1595D8" />
          </linearGradient>
          <linearGradient id="rightGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#53647C" />
            <stop offset="100%" stopColor="#2F3E53" />
          </linearGradient>
          <linearGradient id="bottomGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#172131" />
            <stop offset="100%" stopColor="#2E425C" />
          </linearGradient>
          <clipPath id="iconClip">
            <rect x="52" y="52" width="408" height="408" rx="92" ry="92" />
          </clipPath>
        </defs>
        <g clipPath="url(#iconClip)">
          <rect x="52" y="52" width="408" height="408" rx="92" ry="92" fill="url(#topGrad)" />
          <polygon points="52,190 154,246 154,334 52,392" fill="url(#leftGrad)" />
          <polygon points="154,246 256,188 358,246 256,304" fill="url(#centerGrad)" />
          <polygon points="358,246 460,190 460,384 358,326" fill="url(#rightGrad)" />
          <polygon points="52,392 154,334 256,276 358,326 460,384 460,460 52,460" fill="url(#bottomGrad)" />
          <path d="M166 250 L256 198 L346 250 L346 392 L286 392 L256 336 L226 392 L166 392 Z" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinejoin="round" />
          <path d="M188 282 L220 282 L238 336 L256 292 L274 336 L292 282 L324 282 L286 392 L270 392 L256 364 L242 392 L226 392 Z" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  )
}
