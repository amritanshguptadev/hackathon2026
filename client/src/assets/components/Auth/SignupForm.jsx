import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  BadgeCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  LockKeyhole,
  UserCheck,
} from 'lucide-react'
import { handleError, handleSuccess } from '../../../utils'
import HeaderMain from '../Home/HeaderMain'
import Footer from '../Home/Footer'
import { IMAGES } from '../../../data/images'
import { API_URL } from '../../../config/api'

export default function SignupForm() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    studentId: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1) // Visual flow step: 1 = Auth, 2 = User created, 3 = Profile created

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-200' }
    let score = 0
    if (pwd.length >= 6) score += 1
    if (pwd.length >= 8) score += 1
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-amber-400' }
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-blue-400' }
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-emerald-500' }
    return { score: 4, label: 'Strong', color: 'bg-green-600' }
  }

  const pwdStrength = getPasswordStrength(signupInfo.password)
  const passwordsMatch =
    signupInfo.password &&
    signupInfo.confirmPassword &&
    signupInfo.password === signupInfo.confirmPassword

  const handleSignup = async (e) => {
    e.preventDefault()
    const { name, email, password, confirmPassword, college, studentId } =
      signupInfo

    // Client-side validations
    if (!name.trim()) return handleError('Full Name is required')
    if (!email.trim()) return handleError('Email is required')
    if (!password) return handleError('Password is required')
    if (password.length < 6) {
      return handleError('Password must be at least 6 characters')
    }
    if (!confirmPassword) {
      return handleError('Please confirm your password')
    }
    if (password !== confirmPassword) {
      return handleError('Passwords do not match')
    }
    if (!college.trim()) return handleError('College / University is required')
    if (!studentId.trim()) return handleError('Student ID is required')

    try {
      setSubmitting(true)
      setActiveStep(1) // Step 1: Auth

      // Call registration endpoint
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          college: college.trim(),
          university: college.trim(),
          studentId: studentId.trim(),
          studentDeclared: true,
        }),
      })

      setActiveStep(2) // Step 2: User created

      const result = await response.json()
      const { success, message, error } = result

      if (success) {
        setActiveStep(3) // Step 3: Profile created
        handleSuccess(message || 'Account created successfully!')

        // Auto-save temporary registration state for seamless UX
        localStorage.setItem('tempRegisteredEmail', email.trim().toLowerCase())

        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`)
        }, 1200)
      } else if (error) {
        const details = error?.details?.[0]?.message || message
        handleError(details)
      } else {
        handleError(message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      handleError(error.message || 'Registration failed. Check server connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] text-[var(--cm-ink)] flex flex-col justify-between">
      <HeaderMain />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          
          {/* Left Column: Create Account Form */}
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
                Create Account
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-600">
                Join your university peers to buy, sell, and exchange campus items.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[var(--cm-blue)] hover:text-[var(--cm-blue-dark)] underline underline-offset-4 transition-colors"
                >
                  Log in here
                </Link>
              </p>
            </div>

            {/* Architecture Flow Banner: Auth -> User created -> Profile created */}
            <div className="mb-8 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <LockKeyhole size={13} className="text-[var(--cm-blue)]" />
                Registration Flow
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                
                {/* Step 1: Auth */}
                <div
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeStep >= 1
                      ? 'bg-blue-50/80 border-blue-200 text-[var(--cm-blue)] font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <LockKeyhole size={14} />
                    <span className="font-semibold">1. Auth</span>
                  </div>
                  <p className="text-[11px] font-normal text-slate-500 hidden sm:block">
                    Credentials
                  </p>
                </div>

                {/* Step 2: User Created */}
                <div
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeStep >= 2
                      ? 'bg-blue-50/80 border-blue-200 text-[var(--cm-blue)] font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <UserCheck size={14} />
                    <span className="font-semibold">2. User Created</span>
                  </div>
                  <p className="text-[11px] font-normal text-slate-500 hidden sm:block">
                    Auth Account
                  </p>
                </div>

                {/* Step 3: Profile Created */}
                <div
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeStep >= 3
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle2 size={14} />
                    <span className="font-semibold">3. Profile Created</span>
                  </div>
                  <p className="text-[11px] font-normal text-slate-500 hidden sm:block">
                    Campus Info
                  </p>
                </div>
              </div>
            </div>

            {/* Create Account Form */}
            <form className="space-y-4" onSubmit={handleSignup}>
              
              {/* Field 1: Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-slate-800 mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={signupInfo.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-10 pr-4 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                  />
                </div>
              </div>

              {/* Field 2: Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-slate-800 mb-1.5"
                >
                  Email <span className="text-red-500">*</span>
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
                    value={signupInfo.email}
                    onChange={handleChange}
                    placeholder="alex@university.edu"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-10 pr-4 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Use your student or personal email for campus updates.
                </p>
              </div>

              {/* Password & Confirm Password (2-col on tablet/desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 3: Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
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
                      value={signupInfo.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
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
                  {signupInfo.password && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1 flex-1 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full ${pwdStrength.color} transition-all duration-300`}
                          style={{ width: `${(pwdStrength.score / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {pwdStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Field 4: Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={signupInfo.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-10 pr-10 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {signupInfo.confirmPassword && (
                    <p
                      className={`mt-1 text-xs font-medium ${
                        passwordsMatch ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {passwordsMatch ? '✓ Passwords match' : 'Passwords must match'}
                    </p>
                  )}
                </div>
              </div>

              {/* College & Student ID (2-col on tablet/desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Field 5: College */}
                <div>
                  <label
                    htmlFor="college"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    College / University <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="college"
                      type="text"
                      name="college"
                      required
                      value={signupInfo.college}
                      onChange={handleChange}
                      placeholder="e.g. Stanford / Delhi University"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-10 pr-4 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                    />
                  </div>
                </div>

                {/* Field 6: Student ID */}
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BadgeCheck
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="studentId"
                      type="text"
                      name="studentId"
                      required
                      value={signupInfo.studentId}
                      onChange={handleChange}
                      placeholder="e.g. 2024CS1042 / STU-8821"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-10 pr-4 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button: [Create Account] */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--cm-blue)] hover:bg-[var(--cm-blue-dark)] py-3.5 px-6 text-base sm:text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                By creating an account, you agree to our campus exchange community guidelines and verified student trading rules.
              </p>
            </form>
          </div>

          {/* Right Column: Campus Exchange Showcase & Info Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Visual Campus Hero Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 shadow-xl border border-slate-800">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
                  Campus Verified
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-extrabold text-white leading-snug"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Your Hyperlocal Student Marketplace
                </h2>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  BuyKaro connects university students on the same campus to buy, sell, and pass down textbooks, tech, bikes, and dorm essentials with zero shipping hassle.
                </p>

                {/* Benefits List */}
                <div className="mt-6 space-y-3.5 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-white">Direct Peer Hand-Off</p>
                      <p className="text-xs text-slate-400">Meet in the library, hostel, or campus cafeteria safely.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-white">0% Seller Commission</p>
                      <p className="text-xs text-slate-400">Keep every penny you make when you sell your old gear.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-white">Verified College Community</p>
                      <p className="text-xs text-slate-400">Student ID profiles ensure trusted, spam-free listings.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Life Image banner if available */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-[var(--cm-border)] bg-white p-3">
              <div className="flex items-center gap-3">
                <img
                  src={IMAGES.auth.campus || '/images/auth/campus.png'}
                  alt="Campus Marketplace"
                  className="h-20 w-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Trusted by students across top universities
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Sign up now and start exploring textbooks, gadgets, and furniture available right on your campus.
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
