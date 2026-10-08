import Link from 'next/link'
import { Logo } from './Logo'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Logo />
          </Link>
          <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline-block whitespace-nowrap">
            Property Management
          </span>
        </div>
      </div>
    </header>
  )
}
