import '@testing-library/jest-dom'
import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PropertyDashboard } from '../PropertyDashboard'
import { render } from '@/__tests__/test-utils'

// Mock the child components
jest.mock('../DeletePropertyModal', () => ({
  DeletePropertyModal: ({ open, propertyName, onConfirm }: any) => (
    open ? (
      <div data-testid="delete-modal">
        <p>Delete {propertyName}?</p>
        <button onClick={onConfirm}>Confirm Delete</button>
      </div>
    ) : null
  ),
}))

jest.mock('../PropertyCreationModal', () => ({
  PropertyCreationModal: ({ open, onComplete }: any) => (
    open ? (
      <div data-testid="creation-modal">
        <p>Create Property</p>
        <button onClick={onComplete}>Complete</button>
      </div>
    ) : null
  ),
}))

// Mock API hooks
const mockDeleteProperty = jest.fn()
const mockUseGetBuildingsQuery = jest.fn()
const mockUseGetUnitsQuery = jest.fn()

jest.mock('@/lib/store/api/properties', () => ({
  useDeletePropertyMutation: () => [mockDeleteProperty, { isLoading: false }],
}))

jest.mock('@/lib/store/api/buildings', () => ({
  useGetBuildingsQuery: (...args: any[]) => mockUseGetBuildingsQuery(...args),
}))

jest.mock('@/lib/store/api/units', () => ({
  useGetUnitsQuery: (...args: any[]) => mockUseGetUnitsQuery(...args),
}))

describe('PropertyDashboard', () => {
  const mockProperty = {
    id: '1',
    name: 'Test Property',
    propertyNumber: 'P001',
    managementType: 'WEG' as const,
    totalAreaSqm: 1000,
    totalMea: 10000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    propertyManager: {
      id: 'pm-1',
      companyName: 'Test PM Company',
      role: 'PROPERTY_MANAGER' as const,
      email: 'pm@test.com',
      phone: '123456',
      street: 'PM Street',
      houseNumber: '1',
      postalCode: '12345',
      city: 'PM City',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  }

  const mockBuilding = {
    id: 'b1',
    code: 'B1',
    name: 'Building 1',
    street: 'Main Street',
    houseNumber: '123',
    postalCode: '12345',
    city: 'Test City',
    buildingType: 'RESIDENTIAL',
    floors: 5,
    hasElevator: true,
    propertyId: '1',
  }

  const mockUnit = {
    id: 'u1',
    unitNumber: 'A101',
    unitType: 'APARTMENT',
    floor: '1',
    sizeSqm: 75,
    rooms: 3,
    meaShare: 1000,
    buildingId: 'b1',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGetBuildingsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
    mockUseGetUnitsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
    mockDeleteProperty.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) })
  })

  it('should display empty state when no properties exist', () => {
    render(<PropertyDashboard properties={[]} />)

    expect(screen.getByText('No properties yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create new property/i })).toBeInTheDocument()
  })

  it('should render properties list', () => {
    render(<PropertyDashboard properties={[mockProperty]} />)

    expect(screen.getByText('Test Property')).toBeInTheDocument()
    expect(screen.getByText('P001')).toBeInTheDocument()
  })

  it('should expand and display property details', async () => {
    const user = userEvent.setup()
    mockUseGetBuildingsQuery.mockReturnValue({
      data: [mockBuilding],
      isLoading: false,
    })

    render(<PropertyDashboard properties={[mockProperty]} />)

    const expandButton = screen.getByRole('button', { name: /expand/i })
    await user.click(expandButton)

    await waitFor(() => {
      expect(screen.getByText('Property Details')).toBeInTheDocument()
      expect(screen.getByText('Building 1')).toBeInTheDocument()
    })
  })

  it('should display units when building is expanded', async () => {
    const user = userEvent.setup()
    mockUseGetBuildingsQuery.mockReturnValue({
      data: [mockBuilding],
      isLoading: false,
    })
    mockUseGetUnitsQuery.mockReturnValue({
      data: [mockUnit],
      isLoading: false,
    })

    render(<PropertyDashboard properties={[mockProperty]} />)

    await user.click(screen.getByRole('button', { name: /expand/i }))
    await waitFor(() => {
      expect(screen.getByText('Building 1')).toBeInTheDocument()
    })

    const buildingButton = screen.getByText('Building 1').closest('button')!
    await user.click(buildingButton)

    await waitFor(() => {
      expect(screen.getByText('Unit A101')).toBeInTheDocument()
    })
  })

  it('should open delete modal and delete property', async () => {
    const user = userEvent.setup()
    const unwrapMock = jest.fn().mockResolvedValue({})
    mockDeleteProperty.mockReturnValue({ unwrap: unwrapMock })

    render(<PropertyDashboard properties={[mockProperty]} />)

    const deleteButton = screen.getByRole('button', { name: /delete test property/i })
    await user.click(deleteButton)

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /confirm delete/i }))

    await waitFor(() => {
      expect(mockDeleteProperty).toHaveBeenCalledWith('1')
    })
  })

  it('should open creation modal', async () => {
    const user = userEvent.setup()
    render(<PropertyDashboard properties={[mockProperty]} />)

    await user.click(screen.getByRole('button', { name: /create new property/i }))

    expect(screen.getByTestId('creation-modal')).toBeInTheDocument()
  })
})
