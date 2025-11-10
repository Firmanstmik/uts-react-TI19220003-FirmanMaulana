import { useLanguage } from '../context/LanguageContext.jsx'

function Footer() {
  const { t, raw } = useLanguage()
  const footerLinks = raw('footer.links') || []

  return (
    <footer className="border-t border-emerald-100/60 bg-white/90 backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">EcoShop</p>
            <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {t('footer.description')}
            </p>
          </div>
          <div className="flex flex-1 flex-wrap justify-between gap-8 text-sm text-slate-500 dark:text-slate-400">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {t('footer.explore')}
              </p>
              <ul className="mt-3 space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition hover:text-emerald-500 dark:hover:text-emerald-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {t('footer.stayInTouch')}
              </p>
              <p className="mt-3 max-w-xs text-sm">
                {t('footer.newsletterCopy')}
              </p>
              <form className="mt-4 flex flex-wrap gap-2">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                >
                  {t('footer.join')}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} EcoShop. All rights reserved.</p>
          <p className="space-x-4">
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
            <span>{t('footer.cookies')}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

