import '@testing-library/jest-dom'
import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Step2BuildingData } from '../Step2BuildingData'
import { render } from '@/__tests__/test-utils'
import { PropertyFormData } from '@/types/propertyForm'

jest.mock('@/components/DeleteBuildingModal', () => ({
  DeleteBuildingModal: ({ open, onConfirm }: any) =>
    open ? (
      <div data-testid="delete-building-modal">
        <button onClick={onConfirm}>Confirm Delete</button>
      </div>
    ) : null,
}))

describe('Step2BuildingData', () => {
  const mockOnUpdate = jest.fn()
  const mockOnEditingChange = jest.fn()
  const mockFormData: PropertyFormData = {
    managementType: 'WEG',
    propertyName: 'Test Property',
    propertyNumber: 'P001',
    totalAreaSqm: '1000',
    totalMea: '10000',
    propertyManagerId: 'pm-1',
    accountantId: 'acc-1',
    buildings: [],
    units: [],
    declarationFile: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render empty state', () => {
    render(
      <Step2BuildingData
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    expect(screen.getByText('Buildings (0)')).toBeInTheDocument()
    expect(screen.getByText(/no buildings added yet/i)).toBeInTheDocument()
  })

  it('should show building form when Add Building is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Step2BuildingData
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /add building/i }))

    expect(screen.getByText('Add New Building')).toBeInTheDocument()
  })

  it('should add a building', async () => {
    const user = userEvent.setup()
    render(
      <Step2BuildingData
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /add building/i }))
    await user.type(screen.getByPlaceholderText('Street name'), 'Main Street')
    await user.type(screen.getByPlaceholderText('House number'), '123')
    await user.type(screen.getByPlaceholderText('Postal code'), '12345')
    await user.type(screen.getByPlaceholderText('City'), 'Test City')

    await user.click(screen.getByRole('button', { name: /add building/i }))

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          buildings: expect.arrayContaining([
            expect.objectContaining({
              street: 'Main Street',
              city: 'Test City',
            }),
          ]),
        })
      )
    })
  })

  it('should display existing buildings', () => {
    const formDataWithBuilding = {
      ...mockFormData,
      buildings: [
        {
          id: 'b1',
          code: 'B1',
          name: 'Building 1',
          street: 'Main Street',
          houseNumber: '123',
          postalCode: '12345',
          city: 'Test City',
          buildingType: 'RESIDENTIAL' as const,
          hasElevator: true,
          isBarrierFree: false,
          constructionYear: '',
          floors: '',
          parkingAccess: '',
          description: '',
        },
      ],
    }

    render(
      <Step2BuildingData
        formData={formDataWithBuilding}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    expect(screen.getByText('Building 1')).toBeInTheDocument()
  })

  it('should delete a building', async () => {
    const user = userEvent.setup()
    const formDataWithBuilding = {
      ...mockFormData,
      buildings: [
        {
          id: 'b1',
          name: 'Building 1',
          street: 'Main Street',
          houseNumber: '123',
          postalCode: '12345',
          city: 'Test City',
          buildingType: 'RESIDENTIAL' as const,
          code: 'B1',
          hasElevator: true,
          isBarrierFree: false,
          constructionYear: '',
          floors: '',
          parkingAccess: '',
          description: '',
        },
      ],
    }

    render(
      <Step2BuildingData
        formData={formDataWithBuilding}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /delete building/i }))
    await user.click(screen.getByRole('button', { name: /confirm delete/i }))

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({ buildings: [] })
    })
  })
})
