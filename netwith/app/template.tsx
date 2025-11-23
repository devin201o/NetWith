'use client'

import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>
        {children}
      </div>
    </AnimatePresence>
  )
}