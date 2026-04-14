// Request browser notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

// Send a browser notification
export function sendNotification(title, body, options = {}) {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const notif = new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: options.tag || 'splitwork',
    renotify: true,
    ...options,
  })

  // Auto-close after 8 seconds
  setTimeout(() => notif.close(), 8000)
  return notif
}

// Notify about whose turn it is for today's chores
export function notifyTodayChores(chores, members, turnHistory) {
  const todayNum = new Date().getDay()
  const todayStr = new Date().toDateString()
  const NOTIFIED_KEY = 'splitwork_notified_today'

  // Check what we already notified about today
  let notified = {}
  try {
    const stored = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '{}')
    if (stored.date === todayStr) notified = stored.ids || {}
    else localStorage.removeItem(NOTIFIED_KEY) // new day, reset
  } catch { /* ignore */ }

  const todayChores = chores.filter(c =>
    c.due_day === todayNum || (c.recurrence_days && c.recurrence_days.includes(todayNum))
  )

  todayChores.forEach(chore => {
    const wasDone = turnHistory.some(h =>
      h.choreId === chore.id && new Date(h.date).toDateString() === todayStr
    )
    if (wasDone) return
    if (notified[chore.id]) return

    const assigneeName = chore.assignee?.name
      ?? members.find(m => m.id === chore.assignee_id)?.name
      ?? 'Someone'

    sendNotification(
      `${assigneeName}, it's your turn!`,
      `Time to do: ${chore.title}`,
      { tag: `chore-${chore.id}` }
    )

    notified[chore.id] = true
  })

  localStorage.setItem(NOTIFIED_KEY, JSON.stringify({ date: todayStr, ids: notified }))
}

// Notify when chore rotates to next person
export function notifyRotation(choreName, nextPersonName) {
  sendNotification(
    `${nextPersonName}, you're up next!`,
    `${choreName} has been passed to you`,
    { tag: `rotation-${choreName}` }
  )
}
