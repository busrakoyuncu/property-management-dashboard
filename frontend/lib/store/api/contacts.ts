import { api } from './index'

export type ContactRole = 'PROPERTY_MANAGER' | 'ACCOUNTANT'

export interface Contact {
  id: string
  role: ContactRole
  companyName: string
  street?: string
  houseNumber?: string
  postalCode?: string
  city?: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface CreateContactDto {
  role: ContactRole
  companyName: string
  street?: string
  houseNumber?: string
  postalCode?: string
  city?: string
  email?: string
  phone?: string
}

export const contactsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contacts (optionally filtered by role)
    getContacts: builder.query<Contact[], ContactRole | undefined>({
      query: (role) => (role ? `/contacts?role=${role}` : '/contacts'),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Contact' as const, id })),
              { type: 'Contact', id: 'LIST' },
            ]
          : [{ type: 'Contact', id: 'LIST' }],
    }),

    // Get single contact
    getContact: builder.query<Contact, string>({
      query: (id) => `/contacts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contact', id }],
    }),

    // Create contact
    createContact: builder.mutation<Contact, CreateContactDto>({
      query: (body) => ({
        url: '/contacts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
} = contactsApi
