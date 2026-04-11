import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function AddPeopleScreen() {
  const navigate = useNavigate()
  const { house, members, addMember, removeMember } = useApp()
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')

  function handleAdd() {
    if (!name.trim()) return
    addMember({ name: name.trim(), phone: phone.trim() || null })
    setName('')
    setPhone('')
  }

  return (
    <div className="screen bg-[#F7FAF9]">
      <div className="screen-inner p-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Add People</div>
            <div className="text-[#22313F] text-[24px] font-extrabold mt-1">Invite members</div>
          </div>
          <button onClick={() => navigate(-1)} className="text-[#0CC5B9] font-bold text-sm">Save</button>
        </div>

        <div className="mt-5 space-y-4 flex-1">
          {/* Input card */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-2">Name</div>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter full name"
              className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#25303D] text-[15px] w-full outline-none mb-4 placeholder:text-[#848F98]"
            />
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-2">Phone number</div>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+1 602 555 0148"
              className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#25303D] text-[15px] w-full outline-none placeholder:text-[#848F98]"
            />

            {/* Link with phone */}
            {house?.invite_code && (
              <div className="mt-3 rounded-xl bg-[#E9FAF8] px-4 py-3 border border-[#BDEFEA] flex items-center justify-between">
                <div>
                  <div className="text-[#0AA99E] font-bold text-sm">Invite code: {house.invite_code}</div>
                  <div className="text-[#66727D] text-xs mt-1">Share this code to invite members</div>
                </div>
                <button onClick={() => navigator.clipboard?.writeText(house.invite_code)}
                  className="text-[#0CC5B9] font-bold text-lg">↗</button>
              </div>
            )}
          </div>

          {/* People list */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">People added</div>
            <div className="space-y-3">
              {members.length === 0 ? (
                <div className="text-[#848F98] text-sm text-center py-4">No members yet</div>
              ) : (
                members.map(m => (
                  <div key={m.id} className="rounded-xl bg-[#F4F7F6] border border-slate-200 px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-[#25303D] font-semibold text-sm">{m.name ?? 'Unknown'}</div>
                      <div className="text-[#7F8A94] text-xs mt-1">{m.phone ?? 'No phone'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-[#0CC5B9] text-sm font-bold">Linked</div>
                      <button onClick={() => removeMember(m.id)} className="text-red-400 text-sm font-bold">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 pb-5">
          <button onClick={handleAdd} className="w-full bg-[#0CC5B9] text-white rounded-[18px] py-3.5 font-bold text-[16px] shadow-lg">
            Add person
          </button>
        </div>
      </div>
    </div>
  )
}
