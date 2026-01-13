import '@testing-library/jest-dom'
import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PropertyCreationModal } from '../PropertyCreationModal'
import { render } from '@/__tests__/test-utils'

// Mock the step components
jest.mock('../PropertyCreationSteps/Step1GeneralInfo', () => ({
  Step1GeneralInfo: ({ formData, onUpdate }: any) => (
    <div data-testid="step1">
      <input
        data-testid="property-name-input"
        value={formData.propertyName}
        onChange={(e) => onUpdate({ propertyName: e.target.value })}
      />
      <select
        data-testid="management-type-select"
        value={formData.managementType}
        onChange={(e) => onUpdate({ managementType: e.target.value })}
      >
        <option value="">Select</option>
        <option value="WEG">WEG</option>
      </select>
      <select
        data-testid="manager-select"
        value={formData.propertyManagerId}
        onChange={(e) => onUpdate({ propertyManagerId: e.target.value })}
      >
        <option value="">Select</option>
        <option value="pm-1">Manager 1</option>
      </select>
      <select
        data-testid="accountant-select"
        value={formData.accountantId}
        onChange={(e) => onUpdate({ accountantId: e.target.value })}
      >
        <option value="">Select</option>
        <option value="acc-1">Accountant 1</option>
      </select>
    </div>
  ),
}))

jest.mock('../PropertyCreationSteps/Step2BuildingData', () => ({
  Step2BuildingData: ({ formData, onUpdate }: any) => (
    <div data-testid="step2">
      <button
        data-testid="add-building-btn"
        onClick={() => {
          onUpdate({
            buildings: [
              ...formData.buildings,
              {
                id: `b-${Date.now()}`,
                code: 'B1',
                name: 'Building 1',
                street: 'Main St',
                houseNumber: '1',
                postalCode: '12345',
                city: 'Test City',
                buildingType: 'RESIDENTIAL',
                hasElevator: true,
                isBarrierFree: false,
              },
            ],
          })
        }}
      >
        Add Building
      </button>
    </div>
  ),
}))

jest.mock('../PropertyCreationSteps/Step3Units', () => ({
  Step3Units: ({ formData, onUpdate }: any) => (
    <div data-testid="step3">
      <button
        data-testid="add-unit-btn"
        onClick={() => {
          onUpdate({
            units: [
              ...formData.units,
              {
                id: `u-${Date.now()}`,
                unitNumber: 'A101',
                unitType: 'APARTMENT',
                buildingId: formData.buildings[0]?.id || 'b1',
                meaShare: '1000',
              },
            ],
          })
        }}
      >
        Add Unit
      </button>
    </div>
  ),
}))

const mockCreateProperty = jest.fn()

jest.mock('@/lib/store/api/properties', () => ({
  useCreatePropertyMutation: () => [mockCreateProperty, { isLoading: false }],
}))

describe('PropertyCreationModal', () => {
  const mockOnOpenChange = jest.fn()
  const mockOnComplete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateProperty.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) })
  })

  it('should render modal when open', () => {
    render(
      <PropertyCreationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onComplete={mockOnComplete}
      />
    )

    expect(screen.getByText('Create New Property')).toBeInTheDocument()
    expect(screen.getByTestId('step1')).toBeInTheDocument()
  })

  it('should navigate through all steps', async () => {
    const user = userEvent.setup()
    render(
      <PropertyCreationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onComplete={mockOnComplete}
      />
    )

    // Complete Step 1
    await user.selectOptions(screen.getByTestId('management-type-select'), 'WEG')
    await user.type(screen.getByTestId('property-name-input'), 'Test Property')
    await user.selectOptions(screen.getByTestId('manager-select'), 'pm-1')
    await user.selectOptions(screen.getByTestId('accountant-select'), 'acc-1')
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Complete Step 2
    await waitFor(() => {
      expect(screen.getByTestId('step2')).toBeInTheDocument()
    })
    await user.click(screen.getByTestId('add-building-btn'))
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Reach Step 3
    await waitFor(() => {
      expect(screen.getByTestId('step3')).toBeInTheDocument()
    })
  })

  it('should go back to previous step', async () => {
    const user = userEvent.setup()
    render(
      <PropertyCreationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onComplete={mockOnComplete}
      />
    )

    // Go to step 2
    await user.selectOptions(screen.getByTestId('management-type-select'), 'WEG')
    await user.type(screen.getByTestId('property-name-input'), 'Test')
    await user.selectOptions(screen.getByTestId('manager-select'), 'pm-1')
    await user.selectOptions(screen.getByTestId('accountant-select'), 'acc-1')
    await user.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByTestId('step2')).toBeInTheDocument()
    })

    // Go back
    await user.click(screen.getByRole('button', { name: /back/i }))

    await waitFor(() => {
      expect(screen.getByTestId('step1')).toBeInTheDocument()
    })
  })

  it('should submit property successfully', async () => {
    const user = userEvent.setup()
    const unwrapMock = jest.fn().mockResolvedValue({})
    mockCreateProperty.mockReturnValue({ unwrap: unwrapMock })

    render(
      <PropertyCreationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onComplete={mockOnComplete}
      />
    )

    // Complete all steps
    await user.selectOptions(screen.getByTestId('management-type-select'), 'WEG')
    await user.type(screen.getByTestId('property-name-input'), 'Test')
    await user.selectOptions(screen.getByTestId('manager-select'), 'pm-1')
    await user.selectOptions(screen.getByTestId('accountant-select'), 'acc-1')
    await user.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => expect(screen.getByTestId('step2')).toBeInTheDocument())
    await user.click(screen.getByTestId('add-building-btn'))
    await user.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => expect(screen.getByTestId('step3')).toBeInTheDocument())
    await user.click(screen.getByTestId('add-unit-btn'))

    await user.click(screen.getByRole('button', { name: /create property/i }))

    await waitFor(() => {
      expect(mockCreateProperty).toHaveBeenCalled()
      expect(mockOnComplete).toHaveBeenCalled()
    })
  })

  it('should disable next button when step is invalid', () => {
    render(
      <PropertyCreationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onComplete={mockOnComplete}
      />
    )

    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })
})
