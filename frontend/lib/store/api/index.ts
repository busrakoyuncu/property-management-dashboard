import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define the base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Base API configuration for RTK Query
 * All API slices will be injected into this base API
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Property', 'Building', 'Unit', 'Contact'],
  endpoints: () => ({}),
})
