import Link from 'next/link'
import { BuenaIcon } from './BuenaIcon'
import { BuenaLogo } from './BuenaLogo'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href="https://www.buena.com/en/home" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <BuenaIcon />
            <BuenaLogo />
          </Link>
          <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline-block whitespace-nowrap">Property Management</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <span className="text-xs sm:text-sm text-muted-foreground hidden lg:inline-block">
            Looking for a property manager?
          </span>
          <a
            href="https://www.buena.com/en/offer?utm_id=id-zizby7ggc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-gray-100 whitespace-nowrap"
          >
            Request offer
          </a>
        </div>
      </div>
    </header>
  )
}
