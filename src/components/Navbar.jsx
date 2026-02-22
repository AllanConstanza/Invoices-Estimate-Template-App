'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth() ?? {}
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout?.()
    router.push('/')
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? null

  return (
    <nav className="w-full bg-[#111318] border-b border-white/[0.06] px-6 h-[56px] flex items-center shrink-0">
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() => router.push(user ? '/home' : '/')}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            stroke="#3b63f5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline points="14 2 14 8 20 8" stroke="#3b63f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="13" x2="8" y2="13" stroke="#3b63f5" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="17" x2="8" y2="17" stroke="#3b63f5" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="font-bold text-[17px] text-white tracking-[-0.01em]">JustWrite</span>
      </div>

      {/* Right — user area */}
      <div className="ml-auto relative" ref={menuRef}>
        {user ? (
          <>
            {/* Avatar with initial */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-8 h-8 rounded-full bg-[#3b63f5] flex items-center justify-center text-white text-[13px] font-bold cursor-pointer border-0 hover:bg-[#2f53e0] transition-colors"
              aria-label="User menu"
            >
              {userInitial}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute top-10 right-0 bg-[#1a1b21] border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1 min-w-[200px] z-50">
                <div className="px-3.5 py-2.5 border-b border-white/[0.06]">
                  <p className="text-xs text-[#555] m-0">Signed in as</p>
                  <p className="text-[13px] text-[#ccc] font-medium m-0 mt-0.5 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2.5 text-[13px] text-[#888] hover:text-white hover:bg-white/[0.04] cursor-pointer border-0 bg-transparent transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          /* Generic icon when signed out */
          <button
            onClick={() => router.push('/login')}
            className="w-8 h-8 rounded-full bg-[#1e2029] border border-white/[0.08] flex items-center justify-center hover:bg-[#262731] hover:border-white/[0.14] transition-all cursor-pointer"
            aria-label="Log in"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#888" strokeWidth="1.6" />
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#888" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  )
}
