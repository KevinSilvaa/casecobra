'use client'

import { ReactQueryProvider } from './react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>
}
