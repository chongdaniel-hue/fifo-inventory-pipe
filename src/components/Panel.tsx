import type { ReactNode } from 'react'

export function Panel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-line bg-white p-5 ${className}`}>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  )
}
