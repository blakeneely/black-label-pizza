'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  // Function to get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return 'dark' // Default fallback
  }

  // Update the theme based on system preference or user choice
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      const systemTheme = getSystemTheme()
      setResolvedTheme(systemTheme)
      root.classList.remove('light-theme', 'dark-theme')
      root.classList.add(`${systemTheme}-theme`)
    } else {
      setResolvedTheme(theme)
      root.classList.remove('light-theme', 'dark-theme')
      root.classList.add(`${theme}-theme`)
    }
  }, [theme])

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window !== 'undefined' && theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = () => {
        const newTheme = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(newTheme)
        document.documentElement.classList.remove('light-theme', 'dark-theme')
        document.documentElement.classList.add(`${newTheme}-theme`)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Initialize theme on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Set initial class based on system preference
      const systemTheme = getSystemTheme()
      document.documentElement.classList.add(`${systemTheme}-theme`)
    }
  }, [])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleThemeChange, resolvedTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
