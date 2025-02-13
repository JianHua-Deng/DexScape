import { useAuth } from '../../lib/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Seperator from '../ui/Seperator'
import toast from 'react-hot-toast'

export default function Login() {
  const { googleSignin, login } = useAuth()
  const navigate = useNavigate()

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  async function handleLogin() {
    try {
      await login(loginEmail, loginPassword)
      toast.success('Logged in successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to login')
    }
  }

  return (
    // .login-form-container → full width/height, centered flex-col with gap (1rem ~ gap-4)
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      {/* .login-form → max-width of 50rem, full width/height, centered flex-col with gap (1.75rem ~ gap-7) */}
      <form
        className="max-w-[50rem] w-full h-full flex flex-col justify-center items-center gap-7"
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
      >
        {/* .email-field & .password-field → flex-col aligned left with a small gap (0.5rem ~ gap-2) */}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="email@example.com"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            // Input styling:
            // Default width is 25rem on larger screens and 14rem on small screens,
            // height 2rem, rounded corners, custom border with padding,
            // and focus styles for outline and border color.
            className="w-56 md:w-96 h-12 rounded-[0.5rem] border-[0.1rem] border-[var(--button-color)] p-[0.75rem] focus:outline-none focus:border-[0.13rem] focus:border-[var(--supplementary-color)]"
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            className="w-56 md:w-96 h-12 rounded-[0.5rem] border-[0.1rem] border-[var(--button-color)] p-[0.75rem] focus:outline-none focus:border-[0.13rem] focus:border-[var(--supplementary-color)]"
          />
        </div>

        {/* .submit-field → flex-col centered, spaced with gap (1rem ~ gap-4) and custom text color */}
        <div className="flex flex-col justify-around items-center gap-4 text-[#666]">
          <button type="submit" className="login-button">
            Log in
          </button>
          <span>
            Dont have an account? <Link to="/signup">Sign up!</Link>
          </span>
        </div>

        <Seperator text={'Or continue with'} />

        {/* Google login button container */}
        <div>
          {/* .login-with-google-button → flex with icon spacing, custom background and text colors,
              hover and focus styles */}
          <button
            className="text-[rgb(61,61,61)] bg-[rgb(231,231,231)] flex gap-2 items-center hover:bg-[rgb(192,192,192)] focus:outline-none"
            onClick={async (e) => {
              e.preventDefault()
              await googleSignin()
            }}
          >
            {/* .google-icon → set width to 1rem (w-4) with auto height */}
            <img src="/google-icon.svg" alt="google-icon" className="w-4 h-auto" />
            Google
          </button>
        </div>
      </form>
    </div>
  )
}
