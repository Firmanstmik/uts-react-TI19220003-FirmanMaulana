import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useLanguage } from '../context/LanguageContext.jsx'

function OrderSuccess() {
  const location = useLocation()
  const orderId = location.state?.orderId
  const { t } = useLanguage()

  return (
    <motion.section
      className="mx-auto max-w-3xl px-4 py-20 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
          {t('orderSuccess.heading')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          {t('orderSuccess.description')}
        </p>
        {orderId ? (
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {t('orderSuccess.reference', { id: orderId })}
          </p>
        ) : null}
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          {t('orderSuccess.cta')}
        </Link>
      </div>
    </motion.section>
  )
}

export default OrderSuccess

