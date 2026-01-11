'use client'

import { BuenaIcon } from './BuenaIcon'
import { BuenaLogo } from './BuenaLogo'

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <BuenaIcon />
          <BuenaLogo />
        </div>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-buena-green animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 rounded-full bg-buena-green animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 rounded-full bg-buena-green animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}
