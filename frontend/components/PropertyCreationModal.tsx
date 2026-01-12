'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PropertyFormData } from '@/types/propertyForm'
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import { Step1GeneralInfo } from './PropertyCreationSteps/Step1GeneralInfo'
import { Step2BuildingData } from './PropertyCreationSteps/Step2BuildingData'
import { Step3Units } from './PropertyCreationSteps/Step3Units'
import { useCreatePropertyMutation, CreatePropertyDto } from '@/lib/store/api/properties'

interface PropertyCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

const steps = [
  { number: 1, title: 'General Info' },
  { number: 2, title: 'Building Data' },
  { number: 3, title: 'Units' },
]

const initialFormData: PropertyFormData = {
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

export function PropertyCreationModal({
  open,
  onOpenChange,
  onComplete,
}: PropertyCreationModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData)
  const [isStep2Editing, setIsStep2Editing] = useState(false)
  const [isStep3Editing, setIsStep3Editing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createProperty] = useCreatePropertyMutation()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
      setIsStep2Editing(false) // Reset editing state when moving to next step
      setIsStep3Editing(false)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setIsStep2Editing(false) // Reset editing state when going back
      setIsStep3Editing(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData(initialFormData)
    setIsStep2Editing(false)
    setIsStep3Editing(false)
    setError(null)
    onOpenChange(false)
  }

  const handleUpdate = (updates: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  // Helper: Filter out empty/undefined/null values from object
  // This ensures only fields with actual values are sent to the API
  const omitEmpty = <T extends Record<string, any>>(obj: T): Partial<T> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    ) as Partial<T>
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Map units to their buildings
      const buildingUnitsMap = new Map<string, typeof formData.units>()
      for (const unit of formData.units) {
        if (!buildingUnitsMap.has(unit.buildingId)) {
          buildingUnitsMap.set(unit.buildingId, [])
        }
        buildingUnitsMap.get(unit.buildingId)!.push(unit)
      }

      // Build nested structure: property -> buildings -> units
      const buildings = formData.buildings.map((building) => {
        const units = buildingUnitsMap.get(building.id) || []
        
        const buildingData = omitEmpty({
          street: building.street,
          houseNumber: building.houseNumber,
          postalCode: building.postalCode,
          city: building.city,
          buildingType: building.buildingType,
          hasElevator: building.hasElevator,
          isBarrierFree: building.isBarrierFree,
          code: building.code,
          name: building.name,
          constructionYear: building.constructionYear ? parseInt(building.constructionYear) : undefined,
          floors: building.floors ? parseInt(building.floors) : undefined,
          parkingAccess: building.parkingAccess,
          description: building.description,
          units: units.length > 0 
            ? units.map((unit) => omitEmpty({
                unitNumber: unit.unitNumber,
                unitType: unit.unitType,
                meaShare: parseFloat(unit.meaShare),
                parkingNumber: unit.parkingNumber,
                floor: unit.floor,
                entrance: unit.entrance,
                position: unit.position,
                sizeSqm: unit.sizeSqm ? parseFloat(unit.sizeSqm) : undefined,
                rooms: unit.rooms ? parseInt(unit.rooms) : undefined,
                constructionYear: unit.constructionYear ? parseInt(unit.constructionYear) : undefined,
                description: unit.description,
                specialUseRights: unit.specialUseRights,
              }))
            : undefined,
        })

        return buildingData
      })

      // Build property data with conditional optional fields
      const propertyData: CreatePropertyDto = omitEmpty({
        propertyNumber: formData.propertyNumber || `PROP-${Date.now()}`,
        name: formData.propertyName,
        managementType: formData.managementType as 'WEG' | 'MV',
        buildings,
        totalAreaSqm: formData.totalAreaSqm ? parseFloat(formData.totalAreaSqm) : undefined,
        totalMea: formData.totalMea ? parseInt(formData.totalMea) : undefined,
        landRegistryDistrict: formData.landRegistryDistrict,
        landRegistrySheet: formData.landRegistrySheet,
        cadastralDistrict: formData.cadastralDistrict,
        cadastralParcel: formData.cadastralParcel,
        cadastralPlot: formData.cadastralPlot,
        notaryReference: formData.notaryReference,
        declarationDate: formData.declarationDate,
        energyStandard: formData.energyStandard,
        heatingType: formData.heatingType,
        originalOwner: formData.originalOwner,
        propertyManagerId: formData.propertyManagerId,
        accountantId: formData.accountantId,
        managerAppointmentYears: formData.managerAppointmentYears 
          ? parseInt(formData.managerAppointmentYears) 
          : undefined,
      }) as CreatePropertyDto

      // Create property with nested buildings and units in one request
      await createProperty(propertyData).unwrap()

      // Success!
      onComplete?.()
    handleClose()
    } catch (err: any) {
      console.error('Failed to create property:', err)
      setError(err?.data?.message || 'Failed to create property. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.managementType !== '' &&
        formData.propertyName.trim() !== '' &&
        formData.propertyManagerId !== '' &&
        formData.accountantId !== ''
      )
    }
    if (step === 2) {
      // At least one building must be added and not currently editing
      return formData.buildings.length > 0 && !isStep2Editing
    }
    if (step === 3) {
      // At least one unit must be added and not currently editing
      return formData.units.length > 0 && !isStep3Editing
    }
    return false
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header with step indicator */}
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Property</DialogTitle>
          </DialogHeader>
          
          {/* Step Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-start">
              {steps.map((stepItem, index) => {
                const isCompleted = step > stepItem.number
                const isActive = step === stepItem.number
                
                return (
                  <React.Fragment key={stepItem.number}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all ${
                          isCompleted || isActive
                            ? 'bg-buena-yellow border-buena-yellow text-white'
                            : 'bg-background border-gray-300 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          stepItem.number
                        )}
                      </div>
                      <div
                        className={`text-xs font-medium mt-2 whitespace-nowrap ${
                          isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {stepItem.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 flex items-center px-4 mt-[18px]">
                        <div
                          className={`w-full h-0.5 transition-colors ${
                            isCompleted ? 'bg-buena-yellow' : 'bg-gray-300'
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}
          {step === 1 && <Step1GeneralInfo formData={formData} onUpdate={handleUpdate} />}
          {step === 2 && (
            <Step2BuildingData
              formData={formData}
              onUpdate={handleUpdate}
              onEditingChange={setIsStep2Editing}
            />
          )}
          {step === 3 && (
            <Step3Units
              formData={formData}
              onUpdate={handleUpdate}
              onEditingChange={setIsStep3Editing}
            />
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? handleClose : handleBack}
              className="rounded-full"
            >
              {step === 1 ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="rounded-full bg-buena-green hover:bg-buena-green/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? (
                isSubmitting ? 'Creating...' : 'Create Property'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
