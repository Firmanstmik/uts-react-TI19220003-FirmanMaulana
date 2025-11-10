import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Languages, Menu, Moon, Sun, UserRound, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { logout } from '../store/slices/authSlice.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import logoEco from '../assets/img/logo eco.png'

const baseLinkClasses =
  'relative inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2'

function NavItem({ to, end = false, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${baseLinkClasses} ${
          isActive
            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
            : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-emerald-200'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalQuantity } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const { darkMode, toggleTheme } = useTheme()
  const { language, setLanguage, toggleLanguage, availableLanguages, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    toast(t('auth.greeting'), { icon: '👋' })
    setOpen(false)
    setProfileOpen(false)
  }

  const renderLanguageToggle = (variant = 'desktop') => (
    <div
      className={
        variant === 'desktop'
          ? 'hidden items-center gap-2 md:flex'
          : 'mt-3 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700'
      }
    >
      {variant === 'mobile' ? (
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Languages size={16} className="text-emerald-500" />
          <span>{t('languageToggle.tooltip')}</span>
        </div>
      ) : null}
      <div className="inline-flex items-center rounded-full border border-transparent bg-slate-100 p-1 text-xs font-semibold text-slate-500 shadow-inner transition dark:bg-slate-800">
        {availableLanguages.map((code) => {
          const active = language === code
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              className={`rounded-full px-3 py-1 transition ${
                active
                  ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-200'
              }`}
              aria-label={`${t('languageToggle.ariaLabel')} ${code.toUpperCase()}`}
            >
              {t(`languageToggle.options.${code}`)}
            </button>
          )
        })}
      </div>
      {variant === 'desktop' ? null : (
        <button
          type="button"
          onClick={() => toggleLanguage()}
          className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-200"
          aria-label={t('languageToggle.ariaLabel')}
        >
          <Languages size={16} />
        </button>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-emerald-100 ring-1 ring-emerald-500/40 transition hover:ring-emerald-500">
            <img src={logoEco} alt="EcoShop logo" className="h-9 w-9 object-contain" />
          </span>
          <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">EcoShop</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/" end>
            {t('nav.home')}
          </NavItem>
          <NavItem to="/products">{t('nav.products')}</NavItem>
          <NavItem to="/cart">
            {t('nav.cart')}
            {totalQuantity > 0 ? (
              <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-semibold text-white">
                {totalQuantity}
              </span>
            ) : null}
          </NavItem>
          {isAuthenticated ? <NavItem to="/orders">{t('nav.orders')}</NavItem> : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
            aria-label={t('nav.switchTheme')}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {renderLanguageToggle('desktop')}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:border-emerald-500/60 dark:hover:text-emerald-100"
              >
                <UserRound size={16} />
                <span className="max-w-[140px] truncate">{user?.name || user?.email}</span>
              </button>
              {profileOpen ? (
                <div className="absolute right-0 z-10 mt-3 w-56 rounded-xl border border-slate-200 bg-white/95 p-3 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900/95">
                  <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      navigate('/profile')
                    }}
                    className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-200"
                  >
                    <UserRound size={16} />
                    {t('nav.profile')}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center justify-between rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-200"
            >
              {t('nav.signIn')}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-200 md:hidden"
          aria-label={t('nav.toggleMenu')}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 pb-6 pt-2 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 md:hidden">
          <nav className="flex flex-col gap-2">
            <NavItem to="/" end>
              {t('nav.home')}
            </NavItem>
            <NavItem to="/products">{t('nav.products')}</NavItem>
            <NavItem to="/cart">
              {t('nav.cart')}
              {totalQuantity > 0 ? (
                <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-semibold text-white">
                  {totalQuantity}
                </span>
              ) : null}
            </NavItem>
            {isAuthenticated ? <NavItem to="/orders">{t('nav.orders')}</NavItem> : null}
            {renderLanguageToggle('mobile')}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-200"
            >
              <span>{t('nav.switchTheme')}</span>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate('/profile')
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-emerald-500/40 dark:text-emerald-200 dark:hover:border-emerald-500/60 dark:hover:text-emerald-100"
                >
                  <UserRound size={16} />
                  {t('nav.profile')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    handleLogout()
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-200"
              >
                {t('nav.signIn')}
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
