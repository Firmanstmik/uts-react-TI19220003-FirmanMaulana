import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { translations } from '../i18n/translations.js'

const LanguageContext = createContext(null)

const DEFAULT_LANGUAGE = 'id'
const STORAGE_KEY = 'ecoLanguage'

function getNestedValue(object, path) {
  return path
    .split('.')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), object)
}

function interpolate(template, variables = {}) {
  if (typeof template !== 'string') {
    return template
  }

  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : `{{${key}}}`,
  )
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LANGUAGE
    }
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language)
    }
  }, [language])

  const value = useMemo(() => {
    const translate = (key, variables) => {
      const localized = getNestedValue(translations[language] ?? {}, key)
      if (localized !== undefined) {
        return interpolate(localized, variables)
      }
      const fallback = getNestedValue(translations.en, key)
      return interpolate(fallback ?? key, variables)
    }

    const translateRaw = (key) => {
      const localized = getNestedValue(translations[language] ?? {}, key)
      if (localized !== undefined) {
        return localized
      }
      const fallback = getNestedValue(translations.en, key)
      return fallback ?? key
    }

    return {
      language,
      setLanguage,
      toggleLanguage: () => {
        setLanguage((prev) => (prev === 'id' ? 'en' : 'id'))
      },
      t: translate,
      raw: translateRaw,
      translations: translations[language],
      availableLanguages: ['id', 'en'],
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

