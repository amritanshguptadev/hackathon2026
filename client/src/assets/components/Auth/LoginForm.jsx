import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Users,
  CheckCircle,
} from 'lucide-react'
import { handleError, handleSuccess } from '../../../utils'
import Footer from '../Home/Footer'
import HeaderMain from '../Home/HeaderMain'
import { IMAGES } from '../../../data/images'
import { API_URL } from '../../../config/api'

export default function LoginForm() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If user just registered, prefill their email
    const tempEmail = localStorage.getItem('tempRegisteredEmail')
    if (tempEmail) {
      setLoginInfo((prev) => ({ ...prev, email: tempEmail }))
      localStorage.removeItem('tempRegisteredEmail')
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = loginInfo

    if (!email.trim()) return handleError('Email is required')
    if (!password) return handleError('Password is required')

    try {
      setSubmitting(true)
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })
      const result = await response.json()
      const { success, message, error, jwtToken, name, studentId, college, university } = result

      if (success) {
        handleSuccess(message || 'Login successful!')
        localStorage.setItem('token', jwtToken)
        localStorage.setItem('loggedInUser', name || 'Student')
        if (studentId) localStorage.setItem('studentId', studentId)
        if (college || university) localStorage.setItem('college', college || university)

        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else if (error) {
        const details = error?.details?.[0]?.message || message
        handleError(details)
      } else {
        handleError(message || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      handleError(error.message || 'Login failed. Please check server connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] text-[var(--cm-ink)] flex flex-col justify-between">
      <HeaderMain />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Column: Login Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-[var(--cm-border)] p-6 sm:p-10 transition-all">
            
            {/* Header / Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[var(--cm-blue)] text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-100">
                <Sparkles size={14} className="animate-pulse" />
                Students Only • Campus Marketplace
              </div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Welcome Back
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-600">
                Log in with your student email to access campus deals & your listings.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                New student on campus?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-[var(--cm-blue)] hover:text-[var(--cm-blue-dark)] underline underline-offset-4 transition-colors"
                >
                  Create Account with Student ID
                </Link>
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleLogin}>
              
              {/* Field 1: Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-slate-800 mb-1.5"
                >
                  Student Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={loginInfo.email}
                    onChange={handleChange}
                    placeholder="you@university.edu"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-10 pr-4 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-800"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link
                    to="/upcoming"
                    className="text-xs font-semibold text-[var(--cm-blue)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={loginInfo.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-10 pr-10 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button: [Log In] */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--cm-blue)] hover:bg-[var(--cm-blue-dark)] py-3.5 px-6 text-base sm:text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              {/* Switch to Sign Up banner */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Need an account?
                  </p>
                  <p className="text-xs text-slate-500">
                    Register with Full Name, Email, College & Student ID
                  </p>
                </div>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all shrink-0"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>

          {/* Right Column: Campus Showcase Banner */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Campus Highlight Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 shadow-xl border border-slate-800">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
                  Campus Marketplace
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-extrabold text-white leading-snug"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Buy & Sell Across Campus Fast
                </h2>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  Join thousands of university students discovering second-hand textbooks, lab instruments, cycles, monitors, and hostel furniture directly from peers.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/50">
                    <p className="text-xl font-bold text-white">0% Fee</p>
                    <p className="text-xs text-slate-400 mt-0.5">Free for all students</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/50">
                    <p className="text-xl font-bold text-emerald-400">100%</p>
                    <p className="text-xs text-slate-400 mt-0.5">Verified peer profiles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety & Verification Card */}
            <div className="rounded-2xl border border-[var(--cm-border)] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-[var(--cm-blue)] shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Safe Campus Hand-Offs
                  </h3>
                  <p className="text-xs text-slate-500">
                    Only registered students on your campus can view listings and contact you.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
