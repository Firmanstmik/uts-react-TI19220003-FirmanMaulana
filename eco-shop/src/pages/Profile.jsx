import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { updateProfile } from '../store/slices/authSlice.js'
import { useLanguage } from '../context/LanguageContext.jsx'

function Profile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '', photo: '' })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phone: user.phone || '',
        photo: user.photo || '',
      })
    }
  }, [user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isAuthenticated || !user) {
      return
    }
    dispatch(updateProfile(form))
    toast.success(t('auth.profileUpdatedToast'))
  }

  if (!user) {
    return null
  }

  return (
    <motion.section
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/80">
        <div className="mb-8 space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-300 sm:text-4xl">
            {t('profile.heading')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('profile.subheading')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/60 shadow-inner dark:border-emerald-900/40 dark:bg-emerald-900/20">
              {form.photo ? (
                <img src={form.photo} alt={form.name || 'Profile'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-emerald-500 dark:text-emerald-200">
                  {form.name ? form.name.slice(0, 2).toUpperCase() : 'EC'}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-lg border border-emerald-200 px-3 py-2 font-semibold text-emerald-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-emerald-500/40 dark:text-emerald-200 dark:hover:border-emerald-500/60 dark:hover:text-emerald-100"
              >
                {t('profile.changePhoto')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = () => {
                      setForm((prev) => ({ ...prev, photo: reader.result }))
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
              {t('profile.nameLabel')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                {t('profile.emailLabel')}
              </label>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{t('profile.emailHelper')}</p>
          </div>
          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">
              {t('profile.addressLabel')}
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder={t('profile.addressPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
              {t('profile.phoneLabel')}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder={t('profile.phonePlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            {t('profile.updateButton')}
          </button>
        </form>
      </div>
    </motion.section>
  )
}

export default Profile


