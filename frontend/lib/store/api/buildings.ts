import { api } from './index'

export interface Building {
  id: string
  propertyId: string
  code?: string
  name?: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  buildingType: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED'
  constructionYear?: number
  floors?: number
  hasElevator: boolean
  isBarrierFree: boolean
  parkingAccess?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBuildingDto {
  propertyId: string
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
}

export interface UpdateBuildingDto extends Partial<Omit<CreateBuildingDto, 'propertyId'>> {}

export const buildingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all buildings (optionally filtered by propertyId)
    getBuildings: builder.query<Building[], string | undefined>({
      query: (propertyId) =>
        propertyId ? `/buildings?propertyId=${propertyId}` : '/buildings',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Building' as const, id })),
              { type: 'Building', id: 'LIST' },
            ]
          : [{ type: 'Building', id: 'LIST' }],
    }),

    // Get single building
    getBuilding: builder.query<Building, string>({
      query: (id) => `/buildings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Building', id }],
    }),

    // Create building
    createBuilding: builder.mutation<Building, CreateBuildingDto>({
      query: (body) => ({
        url: '/buildings',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Building', id: 'LIST' }],
    }),

    // Update building
    updateBuilding: builder.mutation<
      Building,
      { id: string; data: UpdateBuildingDto }
    >({
      query: ({ id, data }) => ({
        url: `/buildings/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Building', id },
        { type: 'Building', id: 'LIST' },
      ],
    }),

    // Delete building
    deleteBuilding: builder.mutation<void, string>({
      query: (id) => ({
        url: `/buildings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Building', id },
        { type: 'Building', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetBuildingsQuery,
  useGetBuildingQuery,
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
} = buildingsApi
