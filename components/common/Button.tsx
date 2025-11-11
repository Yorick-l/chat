import { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  icon,
  iconPosition = 'left',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-colors',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        variant === 'ghost' && 'bg-transparent text-gray-800 hover:bg-gray-100',
        variant === 'link' && 'bg-transparent text-blue-500 hover:text-blue-600',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
    </button>
  )
}
