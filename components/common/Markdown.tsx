'use client'

import { memo, useCallback, useMemo, type ComponentPropsWithoutRef } from 'react'
import ReactMarkdown, { type Components, type Options } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { duotoneDark, duotoneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'

type MarkdownProps = Omit<Options, 'className' | 'remarkPlugins' | 'components'> & {
  className?: string
  remarkPlugins?: Options['remarkPlugins']
  components?: Options['components']
}

function Markdown({
  children,
  className = '',
  remarkPlugins,
  components: userComponents,
  ...rest
}: MarkdownProps) {
  const { theme } = useTheme()
  const syntaxTheme = theme === 'dark' ? duotoneDark : duotoneLight

  const codeComponent = useCallback(
    ({ children, className, ...props }: ComponentPropsWithoutRef<'code'> & { node?: unknown; inline?: boolean }) => {
      const { node, inline, ...rest } = props
      void node
      void inline

      const match = /language-(\w+)/.exec(className || '')
      if (match) {
        return (
          <SyntaxHighlighter
            PreTag="div"
            language={match[1]}
            style={syntaxTheme}
            wrapLongLines
          >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
        )
      }
      return (
        <code {...(rest as ComponentPropsWithoutRef<'code'>)} className={className}>
          {children}
        </code>
      )
    },
    [syntaxTheme]
  ) as Components['code']

  const mergedComponents = useMemo<Components>(() => {
    if (!userComponents) {
      return { code: codeComponent }
    }

    return {
      ...userComponents,
      code: userComponents.code ?? codeComponent,
    }
  }, [codeComponent, userComponents])

  const mergedRemarkPlugins = useMemo(() => {
    const base = Array.isArray(remarkPlugins)
      ? [...remarkPlugins]
      : remarkPlugins
        ? [remarkPlugins]
        : []

    base.push(remarkGfm)
    return base
  }, [remarkPlugins])

  return (
    <div className={cn('markdown-body', className)}>
      <ReactMarkdown {...rest} components={mergedComponents} remarkPlugins={mergedRemarkPlugins}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default memo(Markdown)
