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

interface PropertyCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: (property: any) => void
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
  totalSize: '',
  totalCoOwnershipShares: '',
  propertyManagerId: '',
  accountantId: '',
  buildings: [],
  units: [],
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
    onOpenChange(false)
  }

  const handleUpdate = (updates: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleSubmit = () => {
    // TODO: Handle form submission
    onComplete?.(formData)
    handleClose()
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
              disabled={!isStepValid()}
              className="rounded-full bg-buena-green hover:bg-buena-green/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? (
                'Create Property'
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
