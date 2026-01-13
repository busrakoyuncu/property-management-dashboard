import '@testing-library/jest-dom'
import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Step3Units } from '../Step3Units'
import { render } from '@/__tests__/test-utils'
import { PropertyFormData } from '@/types/propertyForm'

jest.mock('@/components/DeleteUnitModal', () => ({
  DeleteUnitModal: ({ open, onConfirm }: any) =>
    open ? (
      <div data-testid="delete-unit-modal">
        <button onClick={onConfirm}>Confirm Delete</button>
      </div>
    ) : null,
}))

jest.mock('../Step3UnitsTable', () => ({
  UnitsTable: ({ units }: any) => (
    <div data-testid="units-table">
      {units.map((unit: any) => (
        <div key={unit.id}>{unit.unitNumber}</div>
      ))}
    </div>
  ),
}))

jest.mock('../BulkUnitImport', () => ({
  BulkUnitImport: ({ onImport, onClose }: any) => (
    <div data-testid="bulk-import">
      <button onClick={() => onImport([])}>Import</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

jest.mock('../BulkUnitPattern', () => ({
  BulkUnitPattern: ({ onClose }: any) => (
    <div data-testid="bulk-pattern">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

jest.mock('../QuickAddUnit', () => ({
  QuickAddUnit: ({ onClose }: any) => (
    <div data-testid="quick-add">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

describe('Step3Units', () => {
  const mockOnUpdate = jest.fn()
  const mockOnEditingChange = jest.fn()

  const mockBuilding = {
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
  }

  const mockFormData: PropertyFormData = {
    managementType: 'WEG',
    propertyName: 'Test Property',
    propertyNumber: 'P001',
    totalAreaSqm: '1000',
    totalMea: '10000',
    propertyManagerId: 'pm-1',
    accountantId: 'acc-1',
    buildings: [mockBuilding],
    units: [],
    declarationFile: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render unit management interface', () => {
    render(
      <Step3Units
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    expect(screen.getByText('Units (0)')).toBeInTheDocument()
    expect(screen.getByTestId('units-table')).toBeInTheDocument()
  })

  it('should display units in table', () => {
    const formDataWithUnits = {
      ...mockFormData,
      units: [
        {
          id: 'u1',
          unitNumber: 'A101',
          unitType: 'APARTMENT' as const,
          buildingId: 'b1',
          meaShare: '1000',
          floor: '',
          entrance: '',
          position: '',
          sizeSqm: '',
          rooms: '',
          parkingNumber: '',
          constructionYear: '',
          description: '',
          specialUseRights: '',
        },
      ],
    }

    render(
      <Step3Units
        formData={formDataWithUnits}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    expect(screen.getByText('A101')).toBeInTheDocument()
  })

  it('should open quick add modal', async () => {
    const user = userEvent.setup()
    render(
      <Step3Units
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /quick add/i }))

    expect(screen.getByTestId('quick-add')).toBeInTheDocument()
  })

  it('should open bulk import modal', async () => {
    const user = userEvent.setup()
    render(
      <Step3Units
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /bulk import/i }))

    expect(screen.getByTestId('bulk-import')).toBeInTheDocument()
  })

  it('should show warning when no buildings exist', () => {
    const formDataWithoutBuildings = {
      ...mockFormData,
      buildings: [],
    }

    render(
      <Step3Units
        formData={formDataWithoutBuildings}
        onUpdate={mockOnUpdate}
        onEditingChange={mockOnEditingChange}
      />
    )

    expect(screen.getByText(/you need at least one building/i)).toBeInTheDocument()
  })
})
