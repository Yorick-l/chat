import React from 'react'
import { useTheme } from '@/lib/theme'
import Button from '@/components/common/Button'
import { FaMoon, FaSun } from 'react-icons/fa'

export default function Toolbar() {
    const { theme, toggleTheme } = useTheme()
    return (
        <div className="mt-auto flex justify-center">
            <Button icon={theme === 'dark' ? <FaMoon /> : <FaSun />} variant="secondary" onClick={toggleTheme} />
        </div>
    )
}
