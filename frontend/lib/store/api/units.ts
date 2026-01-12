import { api } from './index'

export interface Unit {
  id: string
  buildingId: string
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
  createdAt: string
  updatedAt: string
}

export interface CreateUnitDto {
  buildingId: string
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

export interface UpdateUnitDto extends Partial<Omit<CreateUnitDto, 'buildingId'>> {}

export const unitsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all units (optionally filtered by buildingId)
    getUnits: builder.query<Unit[], string | undefined>({
      query: (buildingId) =>
        buildingId ? `/units?buildingId=${buildingId}` : '/units',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Unit' as const, id })),
              { type: 'Unit', id: 'LIST' },
            ]
          : [{ type: 'Unit', id: 'LIST' }],
    }),

    // Get single unit
    getUnit: builder.query<Unit, string>({
      query: (id) => `/units/${id}`,
      providesTags: (result, error, id) => [{ type: 'Unit', id }],
    }),

    // Create unit
    createUnit: builder.mutation<Unit, CreateUnitDto>({
      query: (body) => ({
        url: '/units',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Unit', id: 'LIST' }],
    }),

    // Update unit
    updateUnit: builder.mutation<Unit, { id: string; data: UpdateUnitDto }>({
      query: ({ id, data }) => ({
        url: `/units/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Unit', id },
        { type: 'Unit', id: 'LIST' },
      ],
    }),

    // Delete unit
    deleteUnit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/units/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Unit', id },
        { type: 'Unit', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetUnitsQuery,
  useGetUnitQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitsApi
