import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { clearCart, decreaseQty, increaseQty, removeFromCart } from '../store/slices/cartSlice.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { getProductById, localizeProduct } from '../utils/mockData.js'

function Cart() {
  const { items, totalPrice } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const formatPrice = (value) => formatCurrency(value, language)
  const [selectedItems, setSelectedItems] = useState(() => new Set(items.map((item) => item.id)))
  useEffect(() => {
    setSelectedItems((prev) => {
      const next = new Set()
      if (prev.size === 0) {
        items.forEach((item) => next.add(item.id))
        return next
      }
      items.forEach((item) => {
        if (prev.has(item.id)) {
          next.add(item.id)
        }
      })
      return next
    })
  }, [items])
  const allSelected = selectedItems.size === items.length && items.length > 0

  const localizedItems = useMemo(
    () =>
      items.map((item) => {
        const baseProduct = getProductById(item.id)
        const localized = localizeProduct(baseProduct, language)
        if (!localized) {
          return item
        }
        return {
          ...item,
          name: localized.name,
          description: localized.description,
        }
      }),
    [items, language],
  )

  const toggleSelection = (id) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelectedItems((prev) => {
      if (allSelected) {
        return new Set()
      }
      return new Set(items.map((item) => item.id))
    })
  }

  const batchTotals = useMemo(() => {
    return localizedItems.reduce(
      (acc, item) => {
        if (!selectedItems.has(item.id)) return acc
        const qty = item.quantity || 1
        acc.products += 1
        acc.quantity += qty
        acc.total += qty * item.price
        return acc
      },
      { products: 0, quantity: 0, total: 0 },
    )
  }, [localizedItems, selectedItems])

  const handleBatchCheckout = () => {
    if (!batchTotals.products) {
      toast.error(t('cart.noSelection', 'Pilih produk terlebih dahulu'))
      return
    }
    const selectedForCheckout = localizedItems
      .filter((item) => selectedItems.has(item.id))
      .map((item) => ({
        id: item.id,
        quantity: item.quantity || 1,
      }))
    navigate('/checkout', {
      state: { batchItems: selectedForCheckout },
    })
  }

  const handleRemove = (id) => {
    const baseProduct = getProductById(id)
    const localized = localizeProduct(baseProduct, language)
    dispatch(removeFromCart(id))
    toast.success(t('cart.removedToast', { name: localized?.name || '' }))
  }

  const handleClear = () => {
    dispatch(clearCart())
    toast(t('cart.clearedToast'), { icon: '🧹' })
  }

  if (items.length === 0) {
    return (
      <motion.section
        className="mx-auto max-w-3xl px-4 py-20 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300">
            {t('cart.emptyTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('cart.emptyCopy')}</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            {t('cart.emptyCta')}
          </Link>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      className="mx-auto max-w-6xl px-4 py-16"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-300 sm:text-4xl">
          {t('cart.heading')}
        </h1>
        <button
          type="button"
          onClick={handleClear}
          className="self-start rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {t('cart.clear')}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
        <div className="hidden grid-cols-12 bg-emerald-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 sm:grid">
          <span className="col-span-1">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
            />
          </span>
          <span className="col-span-5">{t('cart.table.product')}</span>
          <span className="col-span-2 text-center">{t('cart.table.price')}</span>
          <span className="col-span-2 text-center">{t('cart.table.quantity')}</span>
          <span className="col-span-2 text-center">{t('cart.table.subtotal')}</span>
          <span className="col-span-1 text-center">{t('cart.table.remove')}</span>
        </div>
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {localizedItems.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-12 sm:items-center sm:gap-6 sm:px-6"
            >
              <div className="flex items-center sm:col-span-1">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                />
              </div>
              <div className="col-span-5 flex items-start gap-4">
                <img
                  src={`${item.imageURL}?auto=format&fit=crop&w=200&q=80`}
                  alt={item.name}
                  className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.description || t('cart.productCopy')}
                  </p>
                </div>
              </div>
              <div className="col-span-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 sm:text-center">
                {formatPrice(item.price)}
              </div>
              <div className="col-span-2 text-sm text-slate-600 dark:text-slate-300 sm:text-center">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dispatch(decreaseQty(item.id))}
                    className="h-7 w-7 rounded-full border border-slate-300 text-slate-500 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-600 dark:text-slate-300 dark:hover:border-emerald-500"
                    aria-label={t('cart.decreaseQty', 'Kurangi kuantitas')}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(increaseQty(item.id))}
                    className="h-7 w-7 rounded-full border border-slate-300 text-slate-500 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-600 dark:text-slate-300 dark:hover-border-emerald-500"
                    aria-label={t('cart.increaseQty', 'Tambah kuantitas')}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-center">
                {formatPrice(item.price * item.quantity)}
              </div>
              <div className="col-span-1 flex justify-start sm:justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                >
                  {t('cart.remove')}
                </button>
              </div>
              <div className="col-span-12 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:col-span-12">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {t('cart.table.subtotal')}: {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    navigate('/checkout', {
                      state: {
                        singleItem: { id: item.id, quantity: item.quantity },
                      },
                    })
                  }
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  {t('cart.checkoutItem')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex w-full flex-col items-end gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex w-full flex-col items-end gap-1 text-sm text-slate-600 dark:text-slate-300">
            <p>
              {t('cart.selectedCount', {
                count: batchTotals.products,
                quantity: batchTotals.quantity,
              })}
            </p>
            <p className="text-base font-semibold text-emerald-600 dark:text-emerald-300">
              {t('cart.selectedTotal', { total: formatPrice(batchTotals.total) })}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBatchCheckout}
            className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            {t('cart.checkoutSelected')}
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-4 text-right shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('cart.totalLabel')}</p>
          <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
            {formatPrice(totalPrice)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          {t('cart.checkout')}
        </button>
      </div>
    </motion.section>
  )
}

export default Cart

