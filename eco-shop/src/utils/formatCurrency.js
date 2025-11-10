const formatters = {}

export function formatCurrency(amount, language = 'id') {
  const value = Number(amount) || 0
  const locale = language === 'id' ? 'id-ID' : 'en-US'
  const key = `${locale}-IDR`

  if (!formatters[key]) {
    formatters[key] = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return formatters[key].format(value)
}

