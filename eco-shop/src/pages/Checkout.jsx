import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { clearCart, removeFromCart } from '../store/slices/cartSlice.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { getProductById, localizeProduct } from '../utils/mockData.js'

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage
}

function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cart = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const { t, language } = useLanguage()
  const singleItem = location.state?.singleItem
  const batchItems = location.state?.batchItems || null

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    payment: 'COD',
  })

  const activeItems = useMemo(() => {
    if (!singleItem && !batchItems) {
      return cart.items.map((item) => {
        const baseProduct = getProductById(item.id)
        if (!baseProduct) return item
        const localized = localizeProduct(baseProduct, language)
        return {
          ...item,
          name: localized?.name || item.name || baseProduct.translations?.en?.name || '',
          description:
            localized?.description ||
            item.description ||
            baseProduct.translations?.en?.description ||
            '',
          price: baseProduct.price,
        }
      })
    }
    if (batchItems) {
      return batchItems
        .map(({ id, quantity }) => {
          const baseProduct = getProductById(id)
          if (!baseProduct) return null
          const localized = localizeProduct(baseProduct, language)
          return {
            id: baseProduct.id,
            name: localized?.name || baseProduct.translations?.en?.name || '',
            description: localized?.description || baseProduct.translations?.en?.description || '',
            price: baseProduct.price,
            quantity: quantity || cart.items.find((item) => item.id === id)?.quantity || 1,
            imageURL: baseProduct.imageURL,
          }
        })
        .filter(Boolean)
    }
    const baseProduct = getProductById(singleItem.id)
    if (!baseProduct) return []
    const localized = localizeProduct(baseProduct, language)
    return [
      {
        id: baseProduct.id,
        name: localized?.name || baseProduct.translations?.en?.name || '',
        description: localized?.description || baseProduct.translations?.en?.description || '',
        price: baseProduct.price,
        quantity: singleItem.quantity || 1,
        imageURL: baseProduct.imageURL,
      },
    ]
  }, [cart.items, language, singleItem])

  const activeTotals = useMemo(
    () =>
      activeItems.reduce(
        (acc, item) => {
          const qty = item.quantity || 1
          acc.count += qty
          acc.total += qty * item.price
          return acc
        },
        { count: 0, total: 0 },
      ),
    [activeItems],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        address: user.address || prev.address,
        phone: user.phone || prev.phone,
      }))
    }
  }, [user])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!activeItems.length) {
      toast.error(t('checkout.emptyCartRedirect'))
      navigate('/products')
      return
    }

    const timestamp = Date.now()
    const orderData = {
      id: `ECO-${timestamp}`,
      customer: form,
      items: activeItems,
      total: activeTotals.total,
      totalQuantity: activeTotals.count,
      placedAt: new Date(timestamp).toISOString(),
    }

    const storage = getStorage()
    if (storage) {
      const existingOrders = JSON.parse(storage.getItem('ecoOrders') || '[]')
      storage.setItem('ecoOrders', JSON.stringify([...existingOrders, orderData]))
    }

    if (singleItem) {
      dispatch(removeFromCart(singleItem.id))
    } else if (batchItems) {
      batchItems.forEach(({ id }) => {
        dispatch(removeFromCart(id))
      })
    } else {
      dispatch(clearCart())
    }
    toast.success(t('auth.orderPlacedToast'))
    navigate('/order-success', { state: { orderId: orderData.id } })
  }

  return (
    <motion.section
      className="mx-auto max-w-4xl px-4 py-16"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-300 sm:text-4xl">
          {t('checkout.heading')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          {t('checkout.subheading')}
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('checkout.summaryLabel')}</p>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t('checkout.summaryItems', {
              count: activeTotals.count,
              total: formatCurrency(activeTotals.total, language),
            })}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-6 px-6 py-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
              {t('checkout.nameLabel')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder={t('checkout.namePlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              {t('checkout.emailLabel')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder={t('checkout.emailPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">
              {t('checkout.addressLabel')}
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows={3}
              placeholder={t('checkout.addressPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
              {t('checkout.phoneLabel')}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder={t('checkout.phonePlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="payment" className="mb-2 block text-sm font-medium text-slate-700">
              {t('checkout.paymentLabel')}
            </label>
            <select
              id="payment"
              name="payment"
              value={form.payment}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="COD">{t('checkout.paymentOptions.cod')}</option>
              <option value="Transfer">{t('checkout.paymentOptions.transfer')}</option>
              <option value="Virtual Account">{t('checkout.paymentOptions.virtualAccount')}</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {t('checkout.submit')}
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  )
}

export default Checkout

