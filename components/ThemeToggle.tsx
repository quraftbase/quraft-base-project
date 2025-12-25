// components/ThemeToggle.tsx

'use client'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} className="fixed bottom-4 right-4 p-2 bg-yellow-400 text-black rounded">
      テーマ: {theme}
    </button>
  )
}
