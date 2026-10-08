import Link from 'next/link'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 w-full border-t bg-[#010105] text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-20">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <span className="text-xs sm:text-sm text-white/70">
          &copy; {new Date().getFullYear()} PropManager
        </span>
      </div>
    </footer>
  )
}
