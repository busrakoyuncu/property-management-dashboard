import { api } from './index'
import { Contact } from './contacts'

export interface Property {
  id: string
  propertyNumber: string
  name: string
  managementType: 'WEG' | 'MV'
  landRegistryDistrict?: string
  landRegistrySheet?: string
  cadastralDistrict?: string
  cadastralParcel?: string
  cadastralPlot?: string
  totalAreaSqm?: number
  totalMea: number
  notaryReference?: string
  declarationDate?: string
  energyStandard?: string
  heatingType?: string
  originalOwner?: string
  propertyManagerId?: string
  accountantId?: string
  propertyManager?: Contact | null
  accountant?: Contact | null
  managerAppointmentYears?: number
  createdAt: string
  updatedAt: string
}

export interface CreateUnitNestedDto {
  unitNumber: string
  unitType: 'APARTMENT' | 'OFFICE' | 'GARDEN' | 'PARKING'
  parkingNumber?: string
  floor?: string
  entrance?: string
  position?: string
  sizeSqm?: number
  rooms?: number
  meaShare: number
  constructionYear?: number
  description?: string
  specialUseRights?: string
}

export interface CreateBuildingNestedDto {
  code?: string
  name?: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  buildingType?: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED'
  constructionYear?: number
  floors?: number
  hasElevator?: boolean
  isBarrierFree?: boolean
  parkingAccess?: string
  description?: string
  units?: CreateUnitNestedDto[]
}

export interface CreatePropertyDto {
  propertyNumber: string
  name: string
  managementType: 'WEG' | 'MV'
  landRegistryDistrict?: string
  landRegistrySheet?: string
  cadastralDistrict?: string
  cadastralParcel?: string
  cadastralPlot?: string
  totalAreaSqm?: number
  totalMea?: number
  notaryReference?: string
  declarationDate?: string
  energyStandard?: string
  heatingType?: string
  originalOwner?: string
  propertyManagerId?: string
  accountantId?: string
  managerAppointmentYears?: number
  buildings?: CreateBuildingNestedDto[]
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {}

export interface ParsedPropertyData {
  property: {
    name?: string
    propertyNumber?: string
    managementType?: 'WEG' | 'MV'
    totalAreaSqm?: number
    totalMea?: number
    landRegistryDistrict?: string
    landRegistrySheet?: string
    cadastralDistrict?: string
    cadastralParcel?: string
    cadastralPlot?: string
    notaryReference?: string
    declarationDate?: string
    energyStandard?: string
    heatingType?: string
    originalOwner?: string
    managerAppointmentYears?: number
    propertyManagerName?: string
    propertyManagerEmail?: string
    propertyManagerPhone?: string
    propertyManagerStreet?: string
    propertyManagerHouseNumber?: string
    propertyManagerPostalCode?: string
    propertyManagerCity?: string
    accountantName?: string
    accountantEmail?: string
    accountantPhone?: string
    accountantStreet?: string
    accountantHouseNumber?: string
    accountantPostalCode?: string
    accountantCity?: string
  }
  buildings: Array<{
    code?: string
    name?: string
    street: string
    houseNumber: string
    postalCode: string
    city: string
    constructionYear?: number
    floors?: number
    hasElevator: boolean
    isBarrierFree: boolean
    buildingType: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED'
    parkingAccess?: string
    description?: string
  }>
  units: Array<{
    unitNumber: string
    unitType: 'APARTMENT' | 'OFFICE' | 'GARDEN' | 'PARKING'
    parkingNumber?: string
    buildingCode?: string
    floor?: string
    entrance?: string
    position?: string
    sizeSqm?: number
    rooms?: number
    meaShare: number
    constructionYear?: number
    description?: string
    specialUseRights?: string
  }>
}

export const propertiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all properties
    getProperties: builder.query<Property[], void>({
      query: () => '/properties',
      providesTags: (result: Property[] | undefined) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Property' as const, id })),
              { type: 'Property' as const, id: 'LIST' },
            ]
          : [{ type: 'Property' as const, id: 'LIST' }],
    }),

    // Get single property
    getProperty: builder.query<Property, string>({
      query: (id: string) => `/properties/${id}`,
      providesTags: (_result, _error, id: string) => [{ type: 'Property' as const, id }],
    }),

    // Create property
    createProperty: builder.mutation<Property, CreatePropertyDto>({
      query: (body: CreatePropertyDto) => ({
        url: '/properties',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Property' as const, id: 'LIST' }],
    }),

    // Update property
    updateProperty: builder.mutation<
      Property,
      { id: string; data: UpdatePropertyDto }
    >({
      query: ({ id, data }: { id: string; data: UpdatePropertyDto }) => ({
        url: `/properties/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }: { id: string }) => [
        { type: 'Property' as const, id },
        { type: 'Property' as const, id: 'LIST' },
      ],
    }),

    // Delete property
    deleteProperty: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id: string) => [
        { type: 'Property' as const, id },
        { type: 'Property' as const, id: 'LIST' },
      ],
    }),

    // Parse PDF
    parsePdf: builder.mutation<ParsedPropertyData, File>({
      query: (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: '/properties/parse-pdf',
          method: 'POST',
          body: formData,
        }
      },
    }),
  }),
})

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useParsePdfMutation,
} = propertiesApi
