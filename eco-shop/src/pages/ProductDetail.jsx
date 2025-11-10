import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { addToCart } from '../store/slices/cartSlice.js'
import { getProductById, localizeProduct } from '../utils/mockData.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'

function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { t, raw, language } = useLanguage()

  const productId = Number(id)
  const baseProduct = getProductById(productId)
  const product = useMemo(() => localizeProduct(baseProduct, language), [baseProduct, language])
  const highlights = raw('productDetail.highlights') || []
  const formatPrice = (value) => formatCurrency(value, language)

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addToCart(product))
    toast.success(t('productDetail.toastAdded', { name: product.name }))
  }

  if (!product) {
    return (
      <motion.section
        className="mx-auto max-w-3xl px-4 py-16 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-rose-500">{t('productDetail.notFoundTitle')}</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {t('productDetail.notFoundCopy')}
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-emerald-300 px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-emerald-700 dark:text-emerald-300"
        >
          {t('productDetail.backToCatalog')}
        </Link>
      </motion.section>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="grid gap-8 overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/40 backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70 md:grid-cols-2"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <img
            src={`${product.imageURL}?auto=format&fit=crop&w=1000&q=80`}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
              {product.categoryLabel || product.category}
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t('productDetail.stock', { count: product.stock })}
              </p>
            </div>
            <p className="rounded-2xl border border-emerald-100 bg-white/70 p-4 text-sm leading-relaxed text-slate-600 dark:border-emerald-900/40 dark:bg-slate-900/70 dark:text-slate-300">
              {product.description}
            </p>
            <ul className="grid gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t('productDetail.priceLabel')}
              </span>
              <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-300">
                {formatPrice(product.price)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              {t('productDetail.addToCart')}
            </button>
            <Link
              to="/products"
              className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-emerald-500/40 dark:text-emerald-200"
            >
              {t('productDetail.continueShopping')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetail

