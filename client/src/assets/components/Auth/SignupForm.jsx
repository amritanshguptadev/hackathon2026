import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../../../utils'
import Footer from '../Home/Footer'
import HeaderMain from '../Home/HeaderMain'
import { IMAGES } from '../../../data/images'

export default function SignupForm() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    studentId: '',
    university: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [idCard, setIdCard] = useState(null)
  const [idCardPreview, setIdCardPreview] = useState('')
  const [studentDeclared, setStudentDeclared] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleIdCardChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      setIdCard(null)
      setIdCardPreview('')
      return
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      handleError('Upload a JPG, PNG, or WEBP photo of your student ID card')
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      handleError('ID card photo must be under 5MB')
      e.target.value = ''
      return
    }

    setIdCard(file)
    setIdCardPreview(URL.createObjectURL(file))
  }

  const handleSignin = async (e) => {
    e.preventDefault()
    const { name, studentId, university, email, password, confirmPassword } =
      signupInfo

    if (!name || !studentId || !university || !email || !password) {
      return handleError('All fields are required')
    }
    if (password !== confirmPassword) {
      return handleError('Passwords do not match')
    }
    if (!idCard) {
      return handleError('Please upload your student ID card photo')
    }
    if (!studentDeclared) {
      return handleError(
        'Please confirm you are a university student and the ID card belongs to you'
      )
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('studentId', studentId.trim())
      formData.append('university', university.trim())
      formData.append('email', email.trim())
      formData.append('password', password)
      formData.append('studentDeclared', 'true')
      formData.append('idCard', idCard)

      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      const { success, message, error } = result

      if (success) {
        handleSuccess(message)
        setTimeout(() => {
          navigate('/login')
        }, 1200)
      } else if (error) {
        const details = error?.details?.[0]?.message || message
        handleError(details)
      } else {
        handleError(message || 'Signup failed')
      }
    } catch (error) {
      handleError(error.message || 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <HeaderMain />
      <div className="flex w-full flex-col md:flex-row">
        <div className="raleway flex w-full justify-center px-10 py-10 md:w-2/4 md:py-16">
          <div className="w-full rounded-xl p-5 shadow-2xl md:p-12">
            <div className="pb-4 md:pb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1B6392]">
                Students only
              </p>
              <h1 className="py-2 text-2xl font-black md:text-3xl">
                Create your student account
              </h1>
              <p className="text-base text-gray-600 md:text-lg">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="text-black underline underline-offset-4"
                >
                  Log in
                </Link>
              </p>
            </div>

            <form className="w-full" onSubmit={handleSignin}>
              <div className="my-2">
                <label
                  htmlFor="name"
                  className="block text-base font-bold text-[#1E1E1E] md:text-xl"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="As on your student ID"
                  value={signupInfo.name}
                  onChange={handleChange}
                  className="my-2 h-10 w-full rounded-md border-2 border-gray-500 px-4 text-base focus:border-[#1B6392] focus:outline-none md:h-12 md:text-lg"
                />
              </div>

              <div className="my-2">
                <label
                  htmlFor="studentId"
                  className="block text-base font-bold text-[#1E1E1E] md:text-xl"
                >
                  Student / User ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  name="studentId"
                  placeholder="e.g. 2024CS1042"
                  value={signupInfo.studentId}
                  onChange={handleChange}
                  className="my-2 h-10 w-full rounded-md border-2 border-gray-500 px-4 text-base focus:border-[#1B6392] focus:outline-none md:h-12 md:text-lg"
                />
              </div>

              <div className="my-2">
                <label
                  htmlFor="university"
                  className="block text-base font-bold text-[#1E1E1E] md:text-xl"
                >
                  University / College
                </label>
                <input
                  id="university"
                  type="text"
                  name="university"
                  placeholder="Your campus name"
                  value={signupInfo.university}
                  onChange={handleChange}
                  className="my-2 h-10 w-full rounded-md border-2 border-gray-500 px-4 text-base focus:border-[#1B6392] focus:outline-none md:h-12 md:text-lg"
                />
              </div>

              <div className="my-2">
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
                  placeholder="you@university.edu"
                  value={signupInfo.email}
                  onChange={handleChange}
                  className="my-2 h-10 w-full rounded-md border-2 border-gray-500 px-4 text-base focus:border-[#1B6392] focus:outline-none md:h-12 md:text-lg"
                />
              </div>

              <div className="my-2">
                <label
                  htmlFor="password"
                  className="block text-base font-bold text-[#1E1E1E] md:text-xl"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  value={signupInfo.password}
                  onChange={handleChange}
                  className="my-2 h-10 w-full rounded-md border-2 border-gray-500 px-4 text-base focus:border-[#1B6392] focus:outline-none md:h-12 md:text-lg"
                />
              </div>

              <div className="my-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-base font-bold text-[#1E1E1E] md:text-xl"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={signupInfo.confirmPassword}
                  onChange={handleChange}
                  className="my-2 h-10 w-full rounded-md border-2 border-gray-500 px-4 text-base focus:border-[#1B6392] focus:outline-none md:h-12 md:text-lg"
                />
              </div>

              <div className="my-3">
                <label
                  htmlFor="idCard"
                  className="block text-base font-bold text-[#1E1E1E] md:text-xl"
                >
                  Student ID Card Photo
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a clear photo of your university ID to verify you are a
                  campus student.
                </p>
                <input
                  id="idCard"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleIdCardChange}
                  className="mt-3 block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#1B6392] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#164f74]"
                />
                {idCardPreview ? (
                  <img
                    src={idCardPreview}
                    alt="ID card preview"
                    className="mt-3 h-36 w-full rounded-lg object-cover ring-1 ring-gray-200"
                  />
                ) : null}
              </div>

              <div className="my-3 flex items-start gap-3">
                <input
                  id="studentDeclared"
                  type="checkbox"
                  checked={studentDeclared}
                  onChange={(e) => setStudentDeclared(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <label
                  htmlFor="studentDeclared"
                  className="text-sm text-gray-700 md:text-base"
                >
                  I confirm I am a current student of the university named above,
                  and the ID card photo belongs to me for campus verification.
                </label>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full cursor-pointer rounded-2xl border-2 border-[#1B6392] bg-[#1B6392] py-2 text-xl font-black text-white disabled:cursor-not-allowed disabled:opacity-70 md:text-3xl"
                >
                  {submitting ? 'Creating account...' : 'Sign up as student'}
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
