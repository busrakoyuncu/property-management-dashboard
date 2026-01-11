import Link from 'next/link'
import { BuenaIcon } from './BuenaIcon'
import { BuenaLogo } from './BuenaLogo'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-20">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="https://www.buena.com/en/home" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <BuenaIcon />
            <BuenaLogo />
          </Link>
            <span className="text-sm text-muted-foreground">Property Management</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            Looking for a property manager?
          </span>
          <a
            href="https://www.buena.com/en/offer?utm_id=id-zizby7ggc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-gray-100"
          >
            Request offer
          </a>
        </div>
      </div>
    </header>
  )
}
