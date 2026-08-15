import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
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
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = loginInfo

    if (!email || !password) {
      return handleError('All fields are required')
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      })
      const result = await response.json()
      const { success, message, error, jwtToken, name, studentId } = result

      if (success) {
        handleSuccess(message)
        localStorage.setItem('token', jwtToken)
        localStorage.setItem('loggedInUser', name)
        if (studentId) localStorage.setItem('studentId', studentId)
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else if (error) {
        const details = error?.details?.[0]?.message || message
        handleError(details)
      } else {
        handleError(message || 'Login failed')
      }
    } catch (error) {
      handleError(error.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <HeaderMain />
      <div className="flex w-full flex-col md:flex-row">
        <div className="raleway flex w-full justify-center px-10 py-10 md:w-2/4 md:py-20">
          <div className="w-full rounded-xl p-5 py-10 shadow-2xl md:p-15">
            <div className="pb-6 md:pb-10">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1B6392]">
                Students only
              </p>
              <h1 className="py-3 text-2xl font-black md:text-3xl">
                Login to your account
              </h1>
              <p className="text-base text-gray-500 md:text-lg">
                New student?{' '}
                <Link
                  to="/signup"
                  className="text-black underline underline-offset-4"
                >
                  Create account with student ID & ID card
                </Link>
              </p>
            </div>

            <form className="w-full" onSubmit={handleLogin}>
              <div className="my-1 w-full md:my-2">
                <label
                  htmlFor="email"
                  className="block text-base font-bold text-[#1E1E1E] md:text-xl"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={loginInfo.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  className="my-2 h-10 w-full rounded-md border-2 border-gray-500 px-4 text-base focus:border-[#1B6392] focus:outline-none md:h-12 md:text-lg"
                />
              </div>
              <div className="my-1 w-full md:my-2">
                <label
                  htmlFor="password"
                  className="block text-base font-bold text-[#1E1E1E] md:text-xl"
                >
                  Password
                </label>
                <input
                  name="password"
                  id="password"
                  value={loginInfo.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Your password"
                  className="my-1 h-10 w-full rounded-md border-2 border-gray-500 px-4 text-base focus:border-[#1B6392] focus:outline-none md:h-12 md:text-lg"
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full cursor-pointer rounded-2xl border-2 border-[#1B6392] bg-[#1B6392] py-2 text-xl font-black text-white disabled:cursor-not-allowed disabled:opacity-70 md:text-3xl"
                >
                  {submitting ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden w-full md:block md:w-2/4">
          <img
            src={IMAGES.auth.campus}
            alt="Campus marketplace"
            className="h-screen w-full object-cover"
          />
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}
