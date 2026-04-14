import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { SplineScene } from '../components/ui/splite'
import { Spotlight } from '../components/ui/spotlight'
import { ArrowLeft, Send, Mic, MicOff, Bot } from 'lucide-react'

const DAY_MAP = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 }
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function parseCommand(text, { chores, members, addChore, deleteChore, updateChoreStatus, addMember, removeMember }) {
  const lower = text.toLowerCase().trim()

  // --- Add chore ---
  const addChoreMatch = lower.match(/^(?:add|create|new)\s+(?:a\s+)?chore\s+(?:called\s+|named\s+)?["']?(.+?)["']?(?:\s+(?:on|for|every)\s+(.+))?$/i)
  if (addChoreMatch) {
    const title = addChoreMatch[1].replace(/\s+(on|for|every)\s+.+$/, '').trim()
    const dayStr = addChoreMatch[2]
    let dueDays = null
    let recurrenceDays = null
    if (dayStr) {
      const days = dayStr.split(/[,\s&and]+/).map(d => DAY_MAP[d.trim()]).filter(d => d !== undefined)
      if (days.length === 1) dueDays = days[0]
      if (days.length > 0) recurrenceDays = days
    }
    const chore = addChore({ title, dueDays, recurrenceDays, rotation: [] })
    return { reply: `Added chore "${title}"${recurrenceDays ? ` on ${recurrenceDays.map(d => DAY_NAMES[d]).join(', ')}` : ''}` }
  }

  // --- Delete chore ---
  const deleteMatch = lower.match(/^(?:delete|remove|drop)\s+(?:the\s+)?chore\s+["']?(.+?)["']?$/i)
  if (deleteMatch) {
    const name = deleteMatch[1]
    const found = chores.find(c => c.title.toLowerCase().includes(name))
    if (found) {
      deleteChore(found.id)
      return { reply: `Deleted chore "${found.title}"` }
    }
    return { reply: `Couldn't find a chore matching "${name}"` }
  }

  // --- Mark done ---
  const doneMatch = lower.match(/^(?:mark|complete|finish|done)\s+["']?(.+?)["']?\s*(?:as\s+)?(?:done|complete|finished)?$/i)
  if (doneMatch) {
    const name = doneMatch[1].replace(/\s+(as\s+)?(done|complete|finished)$/i, '')
    const found = chores.find(c => c.title.toLowerCase().includes(name) && c.status === 'pending')
    if (found) {
      updateChoreStatus(found.id, 'done')
      return { reply: `Marked "${found.title}" as done!` }
    }
    return { reply: `No pending chore matching "${name}" found` }
  }

  // --- Add member ---
  const addMemberMatch = lower.match(/^(?:add|invite|new)\s+(?:a\s+)?(?:person|member|people|roommate)\s+(?:called\s+|named\s+)?["']?(.+?)["']?$/i)
  if (addMemberMatch) {
    const name = addMemberMatch[1].trim()
    addMember({ name, phone: '' })
    return { reply: `Added ${name} to the house` }
  }

  // --- Remove member ---
  const removeMemberMatch = lower.match(/^(?:remove|delete|kick)\s+(?:the\s+)?(?:person|member|people|roommate)\s+["']?(.+?)["']?$/i)
  if (removeMemberMatch) {
    const name = removeMemberMatch[1]
    const found = members.find(m => m.name.toLowerCase().includes(name))
    if (found) {
      removeMember(found.id)
      return { reply: `Removed ${found.name} from the house` }
    }
    return { reply: `No member matching "${name}" found` }
  }

  // --- Show chores ---
  if (/^(?:show|list|what are|get|my)\s+(?:all\s+)?(?:the\s+)?chores/i.test(lower) || lower === 'chores') {
    if (chores.length === 0) return { reply: 'No chores yet! Say "add chore wash dishes" to create one.' }
    const list = chores.map(c => `- ${c.title} (${c.status}) ${c.assignee?.name ? `[${c.assignee.name}]` : ''}`).join('\n')
    return { reply: `Here are your chores:\n${list}` }
  }

  // --- Show members ---
  if (/^(?:show|list|who|get)\s+(?:all\s+)?(?:the\s+)?(?:members|people|roommates|housemates)/i.test(lower) || lower === 'members' || lower === 'people') {
    if (members.length === 0) return { reply: 'No members yet! Say "add person John" to add someone.' }
    const list = members.map(m => `- ${m.name}`).join('\n')
    return { reply: `House members:\n${list}` }
  }

  // --- Today ---
  if (/^(?:what.s|whats|what is)\s+(?:on\s+)?(?:for\s+)?today/i.test(lower) || lower === 'today') {
    const todayNum = new Date().getDay()
    const todayChores = chores.filter(c =>
      c.due_day === todayNum || (c.recurrence_days && c.recurrence_days.includes(todayNum))
    )
    if (todayChores.length === 0) return { reply: 'Nothing scheduled for today! Enjoy your free time.' }
    const list = todayChores.map(c => `- ${c.title} ${c.assignee?.name ? `(${c.assignee.name}'s turn)` : ''}`).join('\n')
    return { reply: `Today's chores:\n${list}` }
  }

  // --- Help ---
  if (/^(?:help|what can you do|commands)/i.test(lower)) {
    return { reply: `Here's what I can do:\n\n- "add chore wash dishes on monday"\n- "delete chore wash dishes"\n- "mark wash dishes done"\n- "add person John"\n- "remove person John"\n- "show chores"\n- "show members"\n- "what's for today"\n\nTry any of these!` }
  }

  // --- Greeting ---
  if (/^(?:hi|hello|hey|yo|sup|good\s)/i.test(lower)) {
    const greetings = [
      "Hey! I'm your Splitwork assistant. Ask me to add chores, manage members, or check today's tasks!",
      "Hello! Ready to help with your chores. Try 'add chore' or 'show chores'!",
      "Hey there! I can manage your chores and housemates. What do you need?",
    ]
    return { reply: greetings[Math.floor(Math.random() * greetings.length)] }
  }

  return { reply: `I didn't quite get that. Try saying things like:\n- "add chore take out trash"\n- "mark dishes done"\n- "show chores"\n- "add person Alex"\n\nOr say "help" for all commands!` }
}

export default function AiAssistantScreen() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const app = useApp()
  const [messages, setMessages] = useState([
    { id: '0', role: 'ai', text: `Hi ${profile?.name?.split(' ')[0] ?? 'there'}! I'm your Splitwork AI assistant. I can add chores, manage members, mark tasks done, and more. Try typing or tap the mic!` }
  ])
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: crypto.randomUUID(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Parse and respond
    setTimeout(() => {
      const { reply } = parseCommand(text, app)
      const aiMsg = { id: crypto.randomUUID(), role: 'ai', text: reply }
      setMessages(prev => [...prev, aiMsg])
    }, 400)
  }

  async function toggleMic() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', text: 'Speech recognition is not supported in your browser. Please use Chrome or Edge!' }])
      return
    }

    // If already listening, stop
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    // Request microphone permission first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (err) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: 'ai',
        text: 'Microphone access was denied. Please allow microphone permission in your browser settings and try again.'
      }])
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    setMessages(prev => [...prev, {
      id: crypto.randomUUID(), role: 'ai',
      text: 'Listening... Speak your command now.'
    }])

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setListening(false)

      // Show what was heard and process it
      const userMsg = { id: crypto.randomUUID(), role: 'user', text: transcript }
      setMessages(prev => [...prev, userMsg])
      setTimeout(() => {
        const { reply } = parseCommand(transcript, app)
        const aiMsg = { id: crypto.randomUUID(), role: 'ai', text: reply }
        setMessages(prev => [...prev, aiMsg])
      }, 400)
    }

    recognition.onerror = (event) => {
      setListening(false)
      const errorMessages = {
        'not-allowed': 'Microphone permission denied. Please allow it in browser settings.',
        'no-speech': 'No speech detected. Tap the mic and try again.',
        'network': 'Network error. Speech recognition needs an internet connection.',
        'aborted': 'Listening cancelled.',
      }
      const msg = errorMessages[event.error] || `Mic error: ${event.error}. Please try again.`
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', text: msg }])
    }

    recognition.onend = () => setListening(false)

    try {
      recognition.start()
      setListening(true)
    } catch (err) {
      setListening(false)
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: 'ai',
        text: 'Could not start speech recognition. Please try again.'
      }])
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col z-50">
      {/* Spotlight effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#0CC5B9" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-5 pb-3">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#0CC5B9]" />
          <span className="text-white font-bold text-lg">Splitwork AI</span>
        </div>
        {listening && (
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-medium">Listening...</span>
          </div>
        )}
      </div>

      {/* 3D Robot background — sits behind messages */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 relative z-10">
        <div className="max-w-[480px] mx-auto space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#0CC5B9]/60 backdrop-blur-md text-white rounded-br-md border border-[#0CC5B9]/30'
                  : 'bg-white/5 backdrop-blur-md text-white/90 border border-white/10 rounded-bl-md'
              }`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Bot className="w-3.5 h-3.5 text-[#0CC5B9]" />
                    <span className="text-[#0CC5B9] text-xs font-semibold">AI</span>
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="relative z-10 px-4 pb-5 pt-2">
        <div className="max-w-[480px] mx-auto flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a command..."
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 outline-none"
            />
          </div>
          <button onClick={toggleMic}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              listening
                ? 'bg-red-500 shadow-lg shadow-red-500/30 animate-pulse'
                : 'bg-white/10 border border-white/15'
            }`}>
            {listening
              ? <MicOff className="w-5 h-5 text-white" />
              : <Mic className="w-5 h-5 text-white/70" />
            }
          </button>
          <button onClick={handleSend}
            className="w-11 h-11 rounded-full bg-[#0CC5B9] flex items-center justify-center shadow-lg shadow-[#0CC5B9]/30">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
