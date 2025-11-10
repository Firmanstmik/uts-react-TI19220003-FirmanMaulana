import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { login } from '../store/slices/authSlice.js'
import { useLanguage } from '../context/LanguageContext.jsx'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { t } = useLanguage()

  const redirectPath = location.state?.from?.pathname || '/'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (form.email && form.password) {
      dispatch(login({ email: form.email }))
      toast.success(t('auth.loginToast'))
      navigate(redirectPath, { replace: true })
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  return (
    <motion.section
      className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 dark:bg-slate-950"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-emerald-100 bg-white px-8 py-10 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
            {t('login.heading')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('login.subheading')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              {t('login.emailLabel')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder={t('login.emailPlaceholder')}
              className="w-full rounded-lg border border-emerald-100 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              {t('login.passwordLabel')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder={t('login.passwordPlaceholder')}
              className="w-full rounded-lg border border-emerald-100 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            {t('login.submit')}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-500">
            {t('login.register')}
          </Link>
        </p>
      </div>
    </motion.section>
  )
}

export default Login