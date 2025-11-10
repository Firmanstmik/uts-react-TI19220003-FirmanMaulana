import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { Leaf, PackageCheck, UsersRound } from 'lucide-react'

import { addToCart } from '../store/slices/cartSlice.js'
import { getLocalizedProducts } from '../utils/mockData.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'

function Home() {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { t, raw, language } = useLanguage()
  const formatPrice = (value) => formatCurrency(value, language)

  const localizedProducts = useMemo(() => getLocalizedProducts(language), [language])
  const featured = localizedProducts.slice(0, 4)
  const stats = raw('home.stats') || []
  const features = raw('home.features') || []
  const featureIcons = [Leaf, PackageCheck, UsersRound]

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.section
        className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 px-6 py-12 shadow-sm dark:border-emerald-900/40 dark:from-slate-950 dark:via-emerald-950/30 dark:to-slate-950"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="space-y-6 lg:w-1/2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-200">
              {t('home.badge')}
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              {t('home.title')}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">{t('home.description')}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                {t('home.primaryCta')}
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-emerald-500/40 dark:text-emerald-200 dark:hover:text-emerald-100"
              >
                {t('home.secondaryCta')}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-emerald-100/80 bg-white/60 p-4 text-sm shadow-sm backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70"
                >
                  <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-300">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative lg:w-1/2">
            <div className="relative h-full rounded-3xl border border-emerald-100 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70">
              <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/30 blur-3xl" />
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.map((product) => (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-emerald-200/40 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <img
                      src={`${product.imageURL}?auto=format&fit=crop&w=400&q=80`}
                      alt={product.name}
                      className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="space-y-2 p-4 text-left">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                        {product.categoryLabel || product.category}
                      </p>
                      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => {
                            dispatch(addToCart(product))
                            toast.success(t('home.productAdded', { name: product.name }))
                          }}
                          className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-400"
                        >
                          {`+ ${t('products.addToCart')}`}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mt-16 grid gap-6 rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-emerald-900/30 dark:bg-slate-950/70 md:grid-cols-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {features.map((item, index) => {
          const Icon = featureIcons[index % featureIcons.length]
          return (
            <div key={item.title} className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/10 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/10">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          )
        })}
      </motion.section>

      <motion.section
        className="mt-16 grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 md:grid-cols-2"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <div className="flex flex-col justify-between space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {t('home.impactTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('home.impactCopy')}</p>
          <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50/70 p-4 text-left text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
            <p className="font-semibold">{t('home.cartStatusTitle')}</p>
            <p>{t('home.cartUnique', { count: cart.items.length })}</p>
            <p>{t('home.cartQuantity', { count: cart.totalQuantity })}</p>
            <p>{t('home.cartTotal', { total: formatPrice(cart.totalPrice) })}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner dark:border-slate-800 dark:bg-slate-900/60">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t('home.customerStories')}
          </h3>
          <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <blockquote className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              {t('home.testimonialOne')}
            </blockquote>
            <blockquote className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              {t('home.testimonialTwo')}
            </blockquote>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home