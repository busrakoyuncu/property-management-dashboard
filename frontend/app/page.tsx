'use client'

import { useState, useEffect } from 'react'
import { PropertyDashboard } from '@/components/PropertyDashboard'
import { Property } from '@/types/property'
import { Loading } from '@/components/Loading'

// TODO: Replace with actual API call
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Parkview Condominium',
    type: 'WEG',
    uniqueNumber: 'PROP-2024-001',
  },
  {
    id: '2',
    name: 'Riverside Apartments',
    type: 'MV',
    uniqueNumber: 'PROP-2024-002',
  },
  {
    id: '3',
    name: 'Downtown Complex',
    type: 'WEG',
    uniqueNumber: 'PROP-2024-003',
  },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-full bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <PropertyDashboard properties={mockProperties} />
      </div>
    </div>
  )
}
