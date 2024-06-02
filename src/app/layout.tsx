import './globals.css'

import type { Metadata } from 'next'
import { Recursive } from 'next/font/google'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/providers'

const recursive = Recursive({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <Navbar />

        <main className="grainy-light flex h-full min-h-[calc(100vh-3.5rem-1px)] flex-col">
          <div className="flex h-full flex-1 flex-col">
            <Providers>{children}</Providers>
          </div>

          <Footer />
        </main>

        <Toaster />
      </body>
    </html>
  )
}
