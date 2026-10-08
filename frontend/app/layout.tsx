import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { StoreProvider } from '@/lib/store/StoreProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['Inter', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'PropManager',
  description: 'Property management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <StoreProvider>
          <Header />
          <main className="flex-1 pt-16 pb-16">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  )
}
