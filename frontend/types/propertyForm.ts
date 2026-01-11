import { PropertyType } from './property'

export type UnitType = 'Apartment' | 'Office' | 'Parking' | 'Garden'
export type BuildingType = 'residential' | 'mixed-use' | 'commercial'

export interface Building {
  id: string // Unique identifier for the building
  name: string // e.g., "Haus A - Parkside"
  street: string
  houseNumber: string
  postalCode: string
  city: string
  constructionYear: string
  floors: string // Number of floors
  hasElevator: boolean
  buildingType: BuildingType
  description?: string
}

export interface Unit {
  id: string // Unique identifier for the unit
  number: string // Unit number, e.g., "01", "02"
  type: UnitType
  buildingId: string // Reference to building
  floor: string // e.g., "Erdgeschoss", "1 Obergeschoss", "4 Obergeschoss (Penthouse)"
  entrance: string // e.g., "A", "B"
  size: string // Size in m²
  coOwnershipShare: string // Co-ownership share (e.g., "110.0/1000")
  constructionYear: string
  rooms: string // Number of rooms
  description?: string
}

export interface PropertyFormData {
  // Step 1: General Info
  managementType: PropertyType | ''
  propertyName: string
  propertyNumber?: string // Object number, e.g., "10.557PRB"
  totalSize?: string // Total property size in m²
  totalCoOwnershipShares?: string // Total MEA, e.g., "1000"
  propertyManagerId: string
  accountantId: string
  // Step 2: Building Data
  buildings: Building[]
  // Step 3: Units
  units: Unit[]
}

export interface StepComponentProps {
  formData: PropertyFormData
  onUpdate: (updates: Partial<PropertyFormData>) => void
  onEditingChange?: (isEditing: boolean) => void
}
