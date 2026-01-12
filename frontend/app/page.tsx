'use client'

import { PropertyDashboard } from '@/components/PropertyDashboard'
import { Loading } from '@/components/Loading'
import { useGetPropertiesQuery } from '@/lib/store/api/properties'

export default function Home() {
  const { data: properties, isLoading, error } = useGetPropertiesQuery()

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-full bg-background p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error loading properties</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <PropertyDashboard properties={properties || []} />
      </div>
    </div>
  )
}
