/**
 * Property type definitions
 */

export type PropertyType = 'WEG' | 'MV'

export interface Property {
  id: string
  name: string
  type: PropertyType
  uniqueNumber: string
  createdAt?: string
  updatedAt?: string
}

export interface PropertyListProps {
  properties: Property[]
  onCreateNew?: () => void
  onDelete?: (propertyId: string) => void
}
