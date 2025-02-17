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

    <div className="w-full h-full flex flex-col justify-center items-center gap-4">

      <form
        className="max-w-[50rem] w-full h-full flex flex-col justify-center items-center gap-7"
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
      >

        <div className="flex flex-col items-start gap-2">
          <label className='text-darkText dark:text-lightText' htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="email@example.com"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required

            className="w-56 md:w-96 h-12 rounded-[0.5rem] border-[0.1rem] border-bg-blue-600 p-[0.75rem] focus:outline-none focus:border-[0.13rem] focus:border-blue-800"
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <label className='text-darkText dark:text-lightText' htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            className="w-56 md:w-96 h-12 rounded-[0.5rem] border-[0.1rem] border-bg-blue-600 p-[0.75rem] focus:outline-none focus:border-[0.13rem] focus:border-blue-800"
          />
        </div>


        <div className="flex flex-col justify-around items-center gap-4 text-[#666]">
          <button type="submit" className="login-button">
            Log in
          </button>
          <span className='text-darkText dark:text-gray-300'>
            Dont have an account? <Link className='hover:font-semibold' to="/signup">Sign up!</Link>
          </span>
        </div>

        <Seperator text={'Or continue with'} />


        <div>

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
