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
        
        'cursor-pointer inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-colors',
        // 自定义主题色，以紫罗兰为主色
        variant === 'primary' && 'bg-violet-600 text-white hover:bg-violet-700',
        variant === 'secondary' && 'bg-violet-50 text-violet-800 hover:bg-violet-100',
        variant === 'ghost' && 'bg-transparent text-violet-800 hover:bg-violet-50',
        variant === 'link' && 'bg-transparent text-violet-600 hover:text-violet-800 underline underline-offset-2',
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
