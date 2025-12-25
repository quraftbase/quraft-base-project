// components/ThemeSelector.tsx

'use client'

import { useTheme } from './ThemeContext'

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as 'futuristic' | 'dragonball')}
      className={`p-2 rounded border ${
        theme === 'futuristic'
          ? 'bg-gray-800 text-white border-cyan-400'
          : 'bg-yellow-300 text-black border-yellow-600'
      }`}
    >
      <option value="futuristic">近未来</option>
      <option value="dragonball">ドラゴンボール風</option>
    </select>
  )
}
