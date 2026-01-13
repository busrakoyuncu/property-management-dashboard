import '@testing-library/jest-dom'
import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Step1GeneralInfo } from '../Step1GeneralInfo'
import { render } from '@/__tests__/test-utils'
import { PropertyFormData } from '@/types/propertyForm'

const mockUseGetContactsQuery = jest.fn()
const mockParsePdf = jest.fn()

jest.mock('@/lib/store/api/contacts', () => ({
  useGetContactsQuery: (...args: any[]) => mockUseGetContactsQuery(...args),
  ContactRole: {
    PROPERTY_MANAGER: 'PROPERTY_MANAGER',
    ACCOUNTANT: 'ACCOUNTANT',
  },
}))

jest.mock('@/lib/store/api/properties', () => ({
  useParsePdfMutation: () => [mockParsePdf, { isLoading: false }],
}))

jest.mock('@/components/CreateContactModal', () => ({
  CreateContactModal: ({ open, onContactCreated }: any) =>
    open ? (
      <div data-testid="create-contact-modal">
        <button onClick={() => onContactCreated('new-id')}>Create</button>
      </div>
    ) : null,
}))

describe('Step1GeneralInfo', () => {
  const mockOnUpdate = jest.fn()
  const mockFormData: PropertyFormData = {
    managementType: '',
    propertyName: '',
    propertyNumber: '',
    totalAreaSqm: '',
    totalMea: '',
    propertyManagerId: '',
    accountantId: '',
    buildings: [],
    units: [],
    declarationFile: null,
  }

  const mockContacts = [
    {
      id: 'pm-1',
      companyName: 'Property Manager 1',
      role: 'PROPERTY_MANAGER',
      email: 'pm1@test.com',
      phone: '123456',
      street: 'PM Street',
      houseNumber: '1',
      postalCode: '12345',
      city: 'PM City',
    },
    {
      id: 'acc-1',
      companyName: 'Accountant 1',
      role: 'ACCOUNTANT',
      email: 'acc1@test.com',
      phone: '123458',
      street: 'Acc Street',
      houseNumber: '1',
      postalCode: '12347',
      city: 'Acc City',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGetContactsQuery.mockReturnValue({
      data: mockContacts,
      isLoading: false,
      refetch: jest.fn(),
    })
    mockParsePdf.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) })
  })

  it('should render form fields', () => {
    render(<Step1GeneralInfo formData={mockFormData} onUpdate={mockOnUpdate} />)

    expect(screen.getByText('Management Type')).toBeInTheDocument()
    expect(screen.getByText('Property Name')).toBeInTheDocument()
    expect(screen.getByText('Property Manager')).toBeInTheDocument()
    expect(screen.getByText('Accountant')).toBeInTheDocument()
  })

  it('should update management type', async () => {
    const user = userEvent.setup()
    render(<Step1GeneralInfo formData={mockFormData} onUpdate={mockOnUpdate} />)

    const wegButton = screen.getByText('Condominium (WEG)').closest('button')!
    await user.click(wegButton)

    expect(mockOnUpdate).toHaveBeenCalledWith({ managementType: 'WEG' })
  })

  it('should handle property name input', async () => {
    const user = userEvent.setup()
    render(<Step1GeneralInfo formData={mockFormData} onUpdate={mockOnUpdate} />)

    const input = screen.getByPlaceholderText('Enter property name')
    await user.type(input, 'Test Property')

    expect(mockOnUpdate).toHaveBeenCalled()
  })

  it('should display contacts in dropdowns', () => {
    render(<Step1GeneralInfo formData={mockFormData} onUpdate={mockOnUpdate} />)

    expect(screen.getByText('Property Manager 1')).toBeInTheDocument()
    expect(screen.getByText('Accountant 1')).toBeInTheDocument()
  })

  it('should parse PDF and update form', async () => {
    const user = userEvent.setup()
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
    const unwrapMock = jest.fn().mockResolvedValue({
      property: {
        name: 'Parsed Property',
        managementType: 'WEG',
      },
      buildings: [],
      units: [],
    })
    mockParsePdf.mockReturnValue({ unwrap: unwrapMock })

    render(<Step1GeneralInfo formData={mockFormData} onUpdate={mockOnUpdate} />)

    const uploadButton = screen.getByRole('button', { name: /upload & parse pdf/i })
    await user.click(uploadButton)

    const fileInput = uploadButton.previousElementSibling as HTMLInputElement
    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(mockParsePdf).toHaveBeenCalledWith(file)
    })
  })
})
