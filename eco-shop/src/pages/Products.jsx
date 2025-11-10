import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Dumbbell,
  Heart,
  Home as HomeIcon,
  Laptop,
  Leaf,
  ShoppingBag,
  Sparkles,
  SprayCan,
  UtensilsCrossed,
} from 'lucide-react'

import { addToCart } from '../store/slices/cartSlice.js'
import baseProducts, { getLocalizedProducts, localizeProduct } from '../utils/mockData.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'

const categoryKeys = ['All', ...new Set(baseProducts.map((item) => item.category))]

const categoryIconMap = {
  All: Sparkles,
  Lifestyle: Leaf,
  'Personal Care': Heart,
  Fashion: ShoppingBag,
  Home: HomeIcon,
  Kitchen: UtensilsCrossed,
  'Tech Accessories': Laptop,
  Fitness: Dumbbell,
  'Home Care': SprayCan,
}

function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const { t, language } = useLanguage()
  const formatPrice = (value) => formatCurrency(value, language)

  const localizedProducts = useMemo(() => getLocalizedProducts(language), [language])

  const categoryLabels = useMemo(() => {
    const labels = {}
    baseProducts.forEach((product) => {
      const localized = localizeProduct(product, language)
      if (localized) {
        labels[product.category] = localized.categoryLabel || localized.category
      }
    })
    return labels
  }, [language])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()
    return localizedProducts.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      if (!matchesCategory) return false
      if (!normalizedQuery) return true
      const texts = [
        item.name,
        item.description,
        item.categoryLabel,
        item.category,
      ]
        .filter(Boolean)
        .map((text) => text.toLowerCase())
      return texts.some((text) => text.includes(normalizedQuery))
    })
  }, [localizedProducts, selectedCategory, searchTerm])

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    toast.success(t('products.toastAdded', { name: product.name }))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-white p-8 shadow-sm dark:border-emerald-900/40 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 sm:text-4xl">
              {t('products.heading')}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              {t('products.description')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              placeholder={t('products.searchPlaceholder')}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('products.resultsCount', { count: filteredProducts.length })}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {categoryKeys.map((category) => {
            const active = selectedCategory === category
            const Icon = categoryIconMap[category] || Sparkles
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-white/70 text-slate-600 hover:bg-emerald-500/10 hover:text-emerald-600 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {category === 'All' ? t('products.allCategory') : categoryLabels[category] || category}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        {filteredProducts.map((product) => (
          <motion.article
            key={product.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-emerald-200/40 dark:border-slate-800 dark:bg-slate-900"
            whileHover={{ scale: 1.01 }}
          >
            <div className="relative">
              <img
                src={`${product.imageURL}?auto=format&fit=crop&w=600&q=80`}
                alt={product.name}
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm dark:bg-slate-900/80 dark:text-emerald-300">
                {product.categoryLabel || product.category}
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                {t('products.inStock', { count: product.stock })}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {product.name}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
                  {product.description}
                </p>
              </div>
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                    {formatPrice(product.price)}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-medium text-emerald-600 transition hover:text-emerald-400 dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    {t('products.viewDetails')}
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="group inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500"
                >
                  {t('products.addToCart')}
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  )
}

export default Products

