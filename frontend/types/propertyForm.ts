import { PropertyType } from './property'

export type UnitType = 'APARTMENT' | 'OFFICE' | 'GARDEN' | 'PARKING'
export type BuildingType = 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED'

export interface Building {
  id: string // Unique identifier for the building
  propertyId?: string // Reference to property (set when property is created)
  code?: string // Building code
  name?: string // e.g., "Haus A - Parkside"
  street: string
  houseNumber: string
  postalCode: string
  city: string
  constructionYear?: string
  floors?: string // Number of floors
  hasElevator: boolean
  isBarrierFree: boolean
  buildingType: BuildingType
  parkingAccess?: string
  description?: string
}

export interface Unit {
  id: string // Unique identifier for the unit
  unitNumber: string // Unit number, e.g., "01", "02"
  unitType: UnitType
  parkingNumber?: string
  buildingId: string // Reference to building
  floor?: string // e.g., "Erdgeschoss", "1 Obergeschoss", "4 Obergeschoss (Penthouse)"
  entrance?: string // e.g., "A", "B"
  position?: string
  sizeSqm?: string // Size in m²
  rooms?: string // Number of rooms
  meaShare: string // MEA share (e.g., "110.0")
  constructionYear?: string
  description?: string
  specialUseRights?: string
}

export interface PropertyFormData {
  // Step 1: General Info
  managementType: PropertyType | ''
  propertyName: string
  propertyNumber?: string // Object number, e.g., "10.557PRB"
  totalAreaSqm?: string // Total property size in m²
  totalMea?: string // Total MEA, e.g., "1000"
  propertyManagerId: string
  accountantId: string
  managerAppointmentYears?: string
  
  // Land registry fields (shown when file is uploaded)
  landRegistryDistrict?: string
  landRegistrySheet?: string
  cadastralDistrict?: string
  cadastralParcel?: string
  cadastralPlot?: string
  
  // Legal reference
  notaryReference?: string
  declarationDate?: string
  
  // Technical
  energyStandard?: string
  heatingType?: string
  
  // Original owner/developer
  originalOwner?: string
  
  // File upload
  declarationFile?: File | null
  
  // Extracted contact information from PDF (for pre-filling contact creation)
  extractedPropertyManager?: {
    companyName: string
    email?: string
    phone?: string
    street?: string
    houseNumber?: string
    postalCode?: string
    city?: string
  }
  extractedAccountant?: {
    companyName: string
    email?: string
    phone?: string
    street?: string
    houseNumber?: string
    postalCode?: string
    city?: string
  }
  
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
