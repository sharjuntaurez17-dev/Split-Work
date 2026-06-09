const COLORS = [
  'bg-teal text-white',
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-orange-400 text-white',
  'bg-pink-500 text-white',
  'bg-emerald-500 text-white',
]

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function getColor(name = '') {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % COLORS.length
  return COLORS[hash]
}

export default function MemberAvatar({ name, size = 'md', activeChores = 0 }) {
  const sizes = {
    sm: 'w-9 h-9 text-[13px]',
    md: 'w-12 h-12 text-[15px]',
    lg: 'w-16 h-16 text-[18px]',
  }
  const colorClass = getColor(name)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`${sizes[size]} rounded-full ${colorClass} flex items-center justify-center font-bold flex-shrink-0`}>
        {getInitials(name)}
      </div>
      {name && (
        <span className="text-[12px] font-semibold text-navy text-center leading-tight max-w-[60px] truncate">
          {name}
        </span>
      )}
      {activeChores > 0 && (
        <span className="text-[11px] text-muted">{activeChores} active</span>
      )}
    </div>
  )
}
