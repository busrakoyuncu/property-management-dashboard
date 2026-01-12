'use client'

import { useState, useRef } from 'react'
import { PropertyType } from '@/types/property'
import { StepComponentProps } from '@/types/propertyForm'
import { useGetContactsQuery, ContactRole } from '@/lib/store/api/contacts'
import { useParsePdfMutation } from '@/lib/store/api/properties'
import { Upload, X, FileText, Sparkles, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateContactModal } from '@/components/CreateContactModal'

export function Step1GeneralInfo({ formData, onUpdate }: StepComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const parseFileInputRef = useRef<HTMLInputElement>(null)
  const hasFile = !!formData.declarationFile

  // State for PDF parsing
  const [isParsing, setIsParsing] = useState(false)
  const [parseSuccess, setParseSuccess] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  // State for contact creation modals
  const [isPropertyManagerModalOpen, setIsPropertyManagerModalOpen] = useState(false)
  const [isAccountantModalOpen, setIsAccountantModalOpen] = useState(false)

  // Fetch contacts from API - refetch after creating new contact
  const { data: allContacts, isLoading: isLoadingContacts, refetch: refetchContacts } = useGetContactsQuery(undefined)
  
  // Filter contacts by role
  const propertyManagers = allContacts?.filter(contact => contact.role === 'PROPERTY_MANAGER') || []
  const accountants = allContacts?.filter(contact => contact.role === 'ACCOUNTANT') || []

  const handleContactCreated = (contactId: string, role: ContactRole) => {
    // Refetch contacts to get the new one
    refetchContacts()
    // Select the newly created contact
    if (role === 'PROPERTY_MANAGER') {
      onUpdate({ propertyManagerId: contactId })
    } else {
      onUpdate({ accountantId: contactId })
    }
  }

  // PDF parsing mutation
  const [parsePdf] = useParsePdfMutation()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      onUpdate({ declarationFile: file })
    }
  }

  const handleFileRemove = () => {
    onUpdate({ declarationFile: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      onUpdate({ declarationFile: file })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleParsePdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      setParseError('Please select a valid PDF file')
      return
    }

    setIsParsing(true)
    setParseError(null)
    setParseSuccess(false)

    try {
      const result = await parsePdf(file).unwrap()
      
      // Helper function to copy fields conditionally with optional transformation
      const copyIfExists = (
        source: Record<string, any>,
        target: any,
        fieldMappings: Record<string, string | ((value: any) => any)>
      ) => {
        Object.entries(fieldMappings).forEach(([sourceKey, targetKeyOrTransform]) => {
          const value = source[sourceKey]
          if (value !== undefined && value !== null && value !== '') {
            if (typeof targetKeyOrTransform === 'function') {
              const transformed = targetKeyOrTransform(value)
              if (transformed !== undefined && transformed !== null) {
                // Use source key when transformation is provided
                target[sourceKey] = transformed
              }
            } else {
              // Use target key when string mapping is provided
              target[targetKeyOrTransform] = value
            }
          }
        })
      }

      // Helper function to find matching contact
      const findMatchingContact = (
        extractedName: string,
        contacts: Array<{ id: string; companyName: string }>
      ) => {
        const normalized = extractedName.trim().toLowerCase()
        
        const exactMatch = contacts.find(
          contact => contact.companyName.trim().toLowerCase() === normalized
        )
        
        if (exactMatch) return exactMatch
        
        return contacts.find(contact => {
          const contactName = contact.companyName.trim().toLowerCase()
          return contactName.includes(normalized) || normalized.includes(contactName)
        })
      }

      // Auto-fill property data
      const propertyUpdates: any = {
        declarationFile: file,
      }

      if (result.property) {
        // Map property fields with optional transformations
        copyIfExists(result.property, propertyUpdates, {
          name: 'propertyName',
          propertyNumber: 'propertyNumber',
          managementType: 'managementType',
          totalAreaSqm: (val) => val?.toString(),
          totalMea: (val) => val?.toString(),
          landRegistryDistrict: 'landRegistryDistrict',
          landRegistrySheet: 'landRegistrySheet',
          cadastralDistrict: 'cadastralDistrict',
          cadastralParcel: 'cadastralParcel',
          cadastralPlot: 'cadastralPlot',
          notaryReference: 'notaryReference',
          declarationDate: 'declarationDate',
          energyStandard: 'energyStandard',
          heatingType: 'heatingType',
          originalOwner: 'originalOwner',
          managerAppointmentYears: (val) => val?.toString(),
        })

        // Handle property manager information
        if (result.property.propertyManagerName) {
          const matchingPM = findMatchingContact(
            result.property.propertyManagerName,
            propertyManagers
          )
          
          if (matchingPM) {
            propertyUpdates.propertyManagerId = matchingPM.id
            console.log('Matched property manager:', matchingPM.companyName)
          } else {
            propertyUpdates.extractedPropertyManager = {
              companyName: result.property.propertyManagerName,
              email: result.property.propertyManagerEmail,
              phone: result.property.propertyManagerPhone,
              street: result.property.propertyManagerStreet,
              houseNumber: result.property.propertyManagerHouseNumber,
              postalCode: result.property.propertyManagerPostalCode,
              city: result.property.propertyManagerCity,
            }
            console.log('No match found for property manager:', result.property.propertyManagerName)
          }
        }

        // Handle accountant information
        if (result.property.accountantName) {
          const matchingAcc = findMatchingContact(
            result.property.accountantName,
            accountants
          )
          
          if (matchingAcc) {
            propertyUpdates.accountantId = matchingAcc.id
            console.log('Matched accountant:', matchingAcc.companyName)
          } else {
            propertyUpdates.extractedAccountant = {
              companyName: result.property.accountantName,
              email: result.property.accountantEmail,
              phone: result.property.accountantPhone,
              street: result.property.accountantStreet,
              houseNumber: result.property.accountantHouseNumber,
              postalCode: result.property.accountantPostalCode,
              city: result.property.accountantCity,
            }
            console.log('No match found for accountant:', result.property.accountantName)
          }
        }
      }

      // Auto-fill building data
      if (result.buildings && result.buildings.length > 0) {
        propertyUpdates.buildings = result.buildings.map((building, index) => ({
          id: `building-${Date.now()}-${index}`,
          code: building.code || '',
          name: building.name || '',
          street: building.street,
          houseNumber: building.houseNumber,
          postalCode: building.postalCode,
          city: building.city,
          constructionYear: building.constructionYear?.toString() || '',
          floors: building.floors?.toString() || '',
          hasElevator: building.hasElevator,
          isBarrierFree: building.isBarrierFree,
          buildingType: building.buildingType,
          parkingAccess: building.parkingAccess || '',
          description: building.description || '',
        }))
      }

      // Auto-fill unit data
      if (result.units && result.units.length > 0) {
        // Create a map of building codes to building IDs
        const buildingCodeToId = new Map<string, string>()
        if (propertyUpdates.buildings) {
          propertyUpdates.buildings.forEach((building: any) => {
            if (building.code) {
              buildingCodeToId.set(building.code, building.id)
            }
          })
        }

        propertyUpdates.units = result.units.map((unit, index) => {
          // Match unit to building by code, or use first building
          const buildingId = unit.buildingCode 
            ? buildingCodeToId.get(unit.buildingCode) || (propertyUpdates.buildings?.[0]?.id || '')
            : (propertyUpdates.buildings?.[0]?.id || '')

          return {
            id: `unit-${Date.now()}-${index}`,
            unitNumber: unit.unitNumber,
            unitType: unit.unitType,
            parkingNumber: unit.parkingNumber || '',
            buildingId,
            floor: unit.floor || '',
            entrance: unit.entrance || '',
            position: unit.position || '',
            sizeSqm: unit.sizeSqm?.toString() || '',
            rooms: unit.rooms?.toString() || '',
            meaShare: unit.meaShare.toString(),
            constructionYear: unit.constructionYear?.toString() || '',
            description: unit.description || '',
            specialUseRights: unit.specialUseRights || '',
          }
        })
      }

      onUpdate(propertyUpdates)
      setParseSuccess(true)
      
      // Reset success message after 3 seconds
      setTimeout(() => setParseSuccess(false), 3000)
    } catch (error: any) {
      console.error('PDF parsing error:', error)
      setParseError(error?.data?.message || 'Failed to parse PDF. Please try again or fill the form manually.')
    } finally {
      setIsParsing(false)
      // Reset file input
      if (parseFileInputRef.current) {
        parseFileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* AI-Powered PDF Upload Section */}
      <div className="bg-buena-beige/20 border-2 border-buena-yellow/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
              AI-Powered Property Import
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your Teilungserklärung (Declaration of Division) PDF and let AI automatically extract property, building, and unit information.
            </p>
            <div className="flex items-center gap-3">
              <input
                ref={parseFileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleParsePdf}
                className="hidden"
                disabled={isParsing}
              />
              <Button
                type="button"
                onClick={() => parseFileInputRef.current?.click()}
                disabled={isParsing}
                className="bg-buena-green hover:bg-buena-green/90 text-white rounded-full"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Parsing PDF...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Parse PDF
                  </>
                )}
              </Button>
              {parseSuccess && (
                <div className="flex items-center gap-2 text-buena-green">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Successfully parsed!</span>
                </div>
              )}
            </div>
            {parseError && (
              <div className="mt-3 flex items-start gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{parseError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Or fill in the details manually below
        </p>
      </div>

      <div>
        <label className="text-sm font-semibold mb-3 block text-foreground">
          Management Type <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onUpdate({ managementType: 'WEG' })}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              formData.managementType === 'WEG'
                ? 'border-buena-green bg-buena-green/5 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            }`}
          >
            <div className="font-semibold text-base mb-1">Condominium (WEG)</div>
            <div className="text-sm text-muted-foreground">
              Communities of owners who share responsibility for common areas
            </div>
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ managementType: 'MV' })}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              formData.managementType === 'MV'
                ? 'border-buena-green bg-buena-green/5 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            }`}
          >
            <div className="font-semibold text-base mb-1">Rental (MV)</div>
            <div className="text-sm text-muted-foreground">
              Rental properties managed for landlords
            </div>
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Property Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={formData.propertyName}
          onChange={(e) => onUpdate({ propertyName: e.target.value })}
          className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
          placeholder="Enter property name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Property Number
          </label>
          <input
            type="text"
            value={formData.propertyNumber || ''}
            onChange={(e) => onUpdate({ propertyNumber: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="e.g., 10.557PRB"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Total Area (m²)
          </label>
          <input
            type="text"
            value={formData.totalAreaSqm || ''}
            onChange={(e) => onUpdate({ totalAreaSqm: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="e.g., 2,450"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Total MEA
          </label>
          <input
            type="text"
            value={formData.totalMea || ''}
            onChange={(e) => onUpdate({ totalMea: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="e.g., 1000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-foreground">
            Property Manager <span className="text-destructive">*</span>
            {formData.extractedPropertyManager && (
              <span className="ml-2 text-xs text-buena-yellow font-normal">
                (Extracted from PDF)
              </span>
            )}
          </label>
          {(hasFile || !formData.propertyManagerId || formData.extractedPropertyManager) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsPropertyManagerModalOpen(true)}
              className="h-7 px-2 text-xs text-buena-green hover:text-buena-green/80 hover:bg-buena-green/10"
            >
              <Plus className="h-3 w-3 mr-1" />
              {formData.extractedPropertyManager ? 'Create from PDF' : 'Add New'}
            </Button>
          )}
        </div>
        <select
          value={formData.propertyManagerId}
          onChange={(e) => onUpdate({ propertyManagerId: e.target.value })}
            disabled={isLoadingContacts}
            className="w-full h-11 pl-4 pr-10 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          }}
        >
            <option value="">
              {isLoadingContacts ? 'Loading...' : 'Select property manager'}
            </option>
          {propertyManagers.map((pm) => (
            <option key={pm.id} value={pm.id}>
                {pm.companyName}
            </option>
          ))}
          {formData.extractedPropertyManager && !propertyManagers.find(pm => pm.companyName === formData.extractedPropertyManager?.companyName) && (
            <option value="" disabled style={{ fontStyle: 'italic', color: '#666' }}>
              {formData.extractedPropertyManager.companyName} (from PDF - click &quot;Create from PDF&quot; to add)
            </option>
          )}
        </select>
        {formData.extractedPropertyManager && !formData.propertyManagerId && (
          <p className="text-xs text-buena-yellow mt-1">
            Extracted: {formData.extractedPropertyManager.companyName} - Click &quot;Create from PDF&quot; to add this contact
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-foreground">
            Accountant <span className="text-destructive">*</span>
            {formData.extractedAccountant && (
              <span className="ml-2 text-xs text-buena-yellow font-normal">
                (Extracted from PDF)
              </span>
            )}
          </label>
          {(hasFile || !formData.accountantId || formData.extractedAccountant) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAccountantModalOpen(true)}
              className="h-7 px-2 text-xs text-buena-green hover:text-buena-green/80 hover:bg-buena-green/10"
            >
              <Plus className="h-3 w-3 mr-1" />
              {formData.extractedAccountant ? 'Create from PDF' : 'Add New'}
            </Button>
          )}
        </div>
        <select
          value={formData.accountantId}
          onChange={(e) => onUpdate({ accountantId: e.target.value })}
            disabled={isLoadingContacts}
            className="w-full h-11 pl-4 pr-10 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          }}
        >
            <option value="">
              {isLoadingContacts ? 'Loading...' : 'Select accountant'}
            </option>
          {accountants.map((acc) => (
            <option key={acc.id} value={acc.id}>
                {acc.companyName}
            </option>
          ))}
          {formData.extractedAccountant && !accountants.find(acc => acc.companyName === formData.extractedAccountant?.companyName) && (
            <option value="" disabled style={{ fontStyle: 'italic', color: '#666' }}>
              {formData.extractedAccountant.companyName} (from PDF - click &quot;Create from PDF&quot; to add)
            </option>
          )}
        </select>
        {formData.extractedAccountant && !formData.accountantId && (
          <p className="text-xs text-buena-yellow mt-1">
            Extracted: {formData.extractedAccountant.companyName} - Click &quot;Create from PDF&quot; to add this contact
          </p>
        )}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Manager Appointment Years
        </label>
        <input
          type="text"
          value={formData.managerAppointmentYears || ''}
          onChange={(e) => onUpdate({ managerAppointmentYears: e.target.value })}
          className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
          placeholder="e.g., 5"
        />
      </div>

      {/* Land Registry Section */}
      <div className="pt-4 border-t">
        <h3 className="text-sm font-semibold mb-4 text-foreground">Land Registry (Grundbuch)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Land Registry District
                </label>
                <input
                  type="text"
                  value={formData.landRegistryDistrict || ''}
                  onChange={(e) => onUpdate({ landRegistryDistrict: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  placeholder="District"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Land Registry Sheet
                </label>
                <input
                  type="text"
                  value={formData.landRegistrySheet || ''}
                  onChange={(e) => onUpdate({ landRegistrySheet: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  placeholder="Sheet"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Cadastral District
                </label>
                <input
                  type="text"
                  value={formData.cadastralDistrict || ''}
                  onChange={(e) => onUpdate({ cadastralDistrict: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  placeholder="Cadastral district"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Cadastral Parcel
                </label>
                <input
                  type="text"
                  value={formData.cadastralParcel || ''}
                  onChange={(e) => onUpdate({ cadastralParcel: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  placeholder="Cadastral parcel"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Cadastral Plot
                </label>
                <input
                  type="text"
                  value={formData.cadastralPlot || ''}
                  onChange={(e) => onUpdate({ cadastralPlot: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  placeholder="Cadastral plot"
                />
              </div>
            </div>
          </div>

          {/* Legal Reference Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-4 text-foreground">Legal Reference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Notary Reference
                </label>
                <input
                  type="text"
                  value={formData.notaryReference || ''}
                  onChange={(e) => onUpdate({ notaryReference: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  placeholder="Notary reference"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Declaration Date
                </label>
                <input
                  type="date"
                  value={formData.declarationDate || ''}
                  onChange={(e) => onUpdate({ declarationDate: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Technical Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-4 text-foreground">Technical Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Energy Standard
                </label>
                <input
                  type="text"
                  value={formData.energyStandard || ''}
                  onChange={(e) => onUpdate({ energyStandard: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  placeholder="Energy standard"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Heating Type
                </label>
                <input
                  type="text"
                  value={formData.heatingType || ''}
                  onChange={(e) => onUpdate({ heatingType: e.target.value })}
                  className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  placeholder="Heating type"
                />
              </div>
            </div>
          </div>

          {/* Original Owner Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-4 text-foreground">Original Owner/Developer</h3>
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                Original Owner
              </label>
              <input
                type="text"
                value={formData.originalOwner || ''}
                onChange={(e) => onUpdate({ originalOwner: e.target.value })}
                className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                placeholder="Original owner/developer"
              />
        </div>
      </div>

      {/* Contact Creation Modals */}
      <CreateContactModal
        open={isPropertyManagerModalOpen}
        onOpenChange={setIsPropertyManagerModalOpen}
        role="PROPERTY_MANAGER"
        onContactCreated={(contactId) => {
          handleContactCreated(contactId, 'PROPERTY_MANAGER')
          // Clear extracted data after contact is created
          onUpdate({ extractedPropertyManager: undefined })
        }}
        initialData={formData.extractedPropertyManager}
      />
      <CreateContactModal
        open={isAccountantModalOpen}
        onOpenChange={setIsAccountantModalOpen}
        role="ACCOUNTANT"
        onContactCreated={(contactId) => {
          handleContactCreated(contactId, 'ACCOUNTANT')
          // Clear extracted data after contact is created
          onUpdate({ extractedAccountant: undefined })
        }}
        initialData={formData.extractedAccountant}
      />
    </div>
  )
}
