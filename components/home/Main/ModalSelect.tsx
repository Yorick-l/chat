import React, { useState } from 'react'

const MODELS = [
  { label: 'GPT-3.5', value: 'gpt-3.5', description: '快速响应，性价比高' },
  { label: 'GPT-4', value: 'gpt-4', description: '更强的推理与创意能力' },
  { label: 'Claude 3', value: 'claude-3', description: '长文本处理表现优秀' },
]

export default function ModalSelect() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].value)

  const handleSelect = (value: string) => {
    setSelectedModel(value)
    // 可以在此通知父级或写入 store
  }

  return (
    <section className="w-full rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            模型选择
          </p>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            选择你的对话助手
          </h2>
        </div>
        <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
          Beta
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {MODELS.map((model) => {
          const isActive = selectedModel === model.value
          return (
            <button
              key={model.value}
              type="button"
              onClick={() => handleSelect(model.value)}
              className={[
                'group flex flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition-all',
                'border-zinc-200 bg-white/70 hover:border-indigo-400 hover:bg-indigo-50/70',
                'dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:border-indigo-400/60 dark:hover:bg-indigo-500/10',
                isActive
                  ? 'border-indigo-500 shadow-indigo-200 ring-2 ring-indigo-400/60 dark:border-indigo-400 dark:ring-indigo-500/50'
                  : 'shadow-none',
              ].join(' ')}
            >
              <span
                className={[
                  'text-sm font-semibold',
                  isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-zinc-800 dark:text-zinc-100',
                ].join(' ')}
              >
                {model.label}
              </span>
              <span className="text-xs text-zinc-500 transition-colors group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300">
                {model.description}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
