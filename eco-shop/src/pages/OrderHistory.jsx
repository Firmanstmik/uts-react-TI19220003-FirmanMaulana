import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { useLanguage } from '../context/LanguageContext.jsx'
import { getProductById, localizeProduct } from '../utils/mockData.js'
import { formatCurrency } from '../utils/formatCurrency.js'

const getStoredOrders = () => {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem('ecoOrders')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to parse stored orders', error)
    return []
  }
}

function formatDate(timestamp, locale, fallback) {
  if (!timestamp) return fallback
  const date = new Date(timestamp)
  return date.toLocaleString(locale)
}

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const { t, language } = useLanguage()

  const locale = useMemo(() => (language === 'id' ? 'id-ID' : 'en-US'), [language])
  const formatPrice = (value) => formatCurrency(value, language)

  useEffect(() => {
    setOrders(getStoredOrders())
  }, [])

  if (!orders.length) {
    return (
      <motion.section
        className="mx-auto max-w-4xl px-4 py-16 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300">
          {t('orders.emptyTitle')}
        </h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {t('orders.emptyCopy')}
        </p>
      </motion.section>
    )
  }

  return (
    <motion.section
      className="mx-auto max-w-4xl px-4 py-16"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-300 sm:text-4xl">
          {t('orders.heading')}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t('orders.subheading')}
        </p>
      </div>
      <div className="space-y-6">
        {orders
          .slice()
          .reverse()
          .map((order) => (
            <article
              key={order.id || order.orderId}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {t('orders.orderNumber', { id: order.id || order.orderId || '—' })}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(order.placedAt || order.date, locale, t('orders.unknownDate'))}
                </p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {t('orders.customer')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {order.customer?.name || order.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {order.customer?.email || order.email || ''}
                  </p>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-600 dark:text-slate-300">
                    {t('orders.total')}
                  </p>
                  <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                    {formatPrice(order.total || 0)}
                  </p>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-700">
                {(order.items || []).map((item) => {
                  const baseProduct = getProductById(item.id)
                  const localized = localizeProduct(baseProduct, language)
                  const displayName = localized?.name || item.name
                  return (
                  <li
                    key={`${order.id || order.orderId}-${item.id}`}
                    className="flex items-center justify-between py-2 text-slate-600 dark:text-slate-300"
                  >
                    <span>
                        {displayName}{' '}
                        <span className="text-xs text-slate-400">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-300">
                      {formatPrice(item.quantity * item.price)}
                    </span>
                  </li>
                  )
                })}
              </ul>
            </article>
          ))}
      </div>
    </motion.section>
  )
}

export default OrderHistory

