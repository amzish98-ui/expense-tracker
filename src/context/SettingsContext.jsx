import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loadJSON, saveJSON } from '../utils/storage'

const SETTINGS_KEY = 'et_settings'

const defaultSettings = {
  darkMode: false,
  currency: 'GBP',
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({ ...defaultSettings, ...loadJSON(SETTINGS_KEY, {}) }))

  useEffect(() => {
    saveJSON(SETTINGS_KEY, settings)
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings])

  const toggleDarkMode = useCallback(() => {
    setSettings((s) => ({ ...s, darkMode: !s.darkMode }))
  }, [])

  const setCurrency = useCallback((currency) => {
    setSettings((s) => ({ ...s, currency }))
  }, [])

  return (
    <SettingsContext.Provider value={{ ...settings, toggleDarkMode, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
