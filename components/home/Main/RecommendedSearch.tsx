import React from 'react'

const TAGS = [
    '机器学习',
    '大语言模型',
    'React',
    'AI 绘画',
    'Prompt 技巧',
    '字符生成',
    '代码优化',
    '自动摘要',
    '情感分析',
    'Midjourney',
]

export default function RecommendedSearch() {
    return (
        <section className="rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
            <header className="mb-3 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">灵感速查</p>
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">热门推荐主题</h2>
                </div>

            </header>

            <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100/70 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-50/70 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:hover:border-indigo-400/60 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-zinc-900"
                    >
                        <span className="h-2 w-2 rounded-full bg-indigo-400 transition group-hover:bg-indigo-500 dark:bg-indigo-500 dark:group-hover:bg-indigo-400" />
                        {tag}
                    </button>
                ))}
            </div>
        </section>
    )
}
