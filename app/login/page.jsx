'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../../src/lib/firebase'
import { useAuth } from '../../src/context/AuthContext'

const googleProvider = new GoogleAuthProvider()

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState('')  // 'email' | 'google' | ''

  // Already logged in → go to home
  useEffect(() => {
    if (!loading && user) router.replace('/home')
  }, [user, loading, router])

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting('email')
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.replace('/home')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setSubmitting('')
    }
  }

  const handleGoogle = async () => {
    setError('')
    setSubmitting('google')
    try {
      await signInWithPopup(auth, googleProvider)
      router.replace('/home')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(friendlyError(err.code))
      }
    } finally {
      setSubmitting('')
    }
  }

  if (loading || user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[#3b63f5] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Glow */}
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59,99,245,0.12) 0%, transparent 68%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 w-full max-w-[380px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#3b63f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" stroke="#3b63f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="13" x2="8" y2="13" stroke="#3b63f5" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="17" x2="8" y2="17" stroke="#3b63f5" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-[17px] text-white tracking-[-0.01em]">JustWrite</span>
        </div>

        {/* Card */}
        <div className="bg-[#1a1b21] border border-white/[0.07] rounded-2xl p-7">

          {/* Tab switcher */}
          <div className="flex bg-[#111318] rounded-xl p-1 mb-6">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                className={`flex-1 py-2 text-sm font-semibold rounded-[10px] cursor-pointer border-0 transition-all ${
                  mode === m
                    ? 'bg-[#3b63f5] text-white'
                    : 'bg-transparent text-[#555] hover:text-[#888]'
                }`}
                onClick={() => { setMode(m); setError('') }}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={!!submitting}
            className="w-full flex items-center justify-center gap-2.5 border border-white/[0.08] bg-[#111318] text-[#ccc] text-sm font-medium py-2.5 rounded-xl cursor-pointer hover:border-white/[0.16] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {submitting === 'google' ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-[#444]">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#111318] text-white text-sm placeholder:text-[#444] outline-none focus:border-[#3b63f5]/60 transition-colors"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#111318] text-white text-sm placeholder:text-[#444] outline-none focus:border-[#3b63f5]/60 transition-colors"
            />

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={!!submitting}
              className="w-full bg-[#3b63f5] text-white font-semibold py-2.5 rounded-xl cursor-pointer border-0 hover:bg-[#2f53e0] transition-colors text-sm mt-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting === 'email' ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                mode === 'login' ? 'Log in' : 'Create account'
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#3a3b45] mt-5">
          By continuing you agree to JustWrite&apos;s Terms of Service.
        </p>

      </div>
    </div>
  )
}

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
