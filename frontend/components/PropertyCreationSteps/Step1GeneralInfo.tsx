'use client'

import { useState, useRef } from 'react'
import { PropertyType } from '@/types/property'
import { StepComponentProps } from '@/types/propertyForm'
import { useGetContactsQuery } from '@/lib/store/api/contacts'
import { Upload, X, FileText } from 'lucide-react'

export function Step1GeneralInfo({ formData, onUpdate }: StepComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasFile = !!formData.declarationFile

  // Fetch contacts from API
  const { data: allContacts, isLoading: isLoadingContacts } = useGetContactsQuery(undefined)
  
  // Filter contacts by role
  const propertyManagers = allContacts?.filter(contact => contact.role === 'PROPERTY_MANAGER') || []
  const accountants = allContacts?.filter(contact => contact.role === 'ACCOUNTANT') || []

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

  return (
    <div className="space-y-6">
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
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Property Manager <span className="text-destructive">*</span>
        </label>
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
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Accountant <span className="text-destructive">*</span>
        </label>
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
        </select>
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

      <div>
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Declaration of Division (Teilungserklärung)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        {!hasFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          >
          <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Drag and drop file here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PDF files only
            </p>
          </div>
          </div>
        ) : (
          <div className="border-2 border-buena-green rounded-xl p-4 bg-buena-green/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-buena-green" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formData.declarationFile?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.declarationFile?.size || 0) / 1024} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFileRemove}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
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
    </div>
  )
}
