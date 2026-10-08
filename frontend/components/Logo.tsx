import { Building2 } from 'lucide-react'

/**
 * Application wordmark: a building glyph in a rounded square plus the app name.
 * Inherits `currentColor`, so it works on both light and dark backgrounds.
 */
export const Logo = () => (
  <span className="flex items-center gap-2 sm:gap-3">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-current">
      <Building2 className="h-5 w-5" aria-hidden="true" />
    </span>
    <span className="text-lg font-semibold tracking-tight">PropManager</span>
  </span>
)
