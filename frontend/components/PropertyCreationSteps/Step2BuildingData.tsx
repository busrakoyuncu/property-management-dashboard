'use client'

import React, { useState } from 'react'
import { StepComponentProps, Building, BuildingType } from '@/types/propertyForm'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import { DeleteBuildingModal } from '../DeleteBuildingModal'

export function Step2BuildingData({ formData, onUpdate, onEditingChange }: StepComponentProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [buildingToDelete, setBuildingToDelete] = useState<{ index: number; building: Building } | null>(null)

  // Notify parent when editing state changes
  React.useEffect(() => {
    const isEditing = isAddingNew || editingIndex !== null
    onEditingChange?.(isEditing)
  }, [isAddingNew, editingIndex, onEditingChange])

  const buildingTypes: { value: BuildingType; label: string }[] = [
    { value: 'RESIDENTIAL', label: 'Residential' },
    { value: 'MIXED', label: 'Mixed-use' },
    { value: 'COMMERCIAL', label: 'Commercial' },
  ]

  const handleAddBuilding = () => {
    setIsAddingNew(true)
    setEditingIndex(-1) // Use -1 to indicate new building
  }

  const handleEditBuilding = (index: number) => {
    setEditingIndex(index)
    setIsAddingNew(false)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setIsAddingNew(false)
  }

  const handleDeleteClick = (index: number) => {
    setBuildingToDelete({ index, building: formData.buildings[index] })
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (buildingToDelete) {
      const updatedBuildings = formData.buildings.filter((_, i) => i !== buildingToDelete.index)
      onUpdate({ buildings: updatedBuildings })
      setBuildingToDelete(null)
    }
  }

  const handleSaveBuilding = (buildingData: Omit<Building, 'id'>) => {
    const buildings = [...formData.buildings]
    
    if (editingIndex === -1) {
      // Adding new building
      const newBuilding: Building = {
        ...buildingData,
        id: `building-${Date.now()}`, // Simple ID generation
      }
      buildings.push(newBuilding)
    } else if (editingIndex !== null) {
      // Editing existing building
      buildings[editingIndex] = {
        ...buildings[editingIndex],
        ...buildingData,
      }
    }
    
    onUpdate({ buildings })
    handleCancelEdit()
  }

  const currentBuilding = editingIndex !== null && editingIndex >= 0 
    ? formData.buildings[editingIndex] 
    : null

  return (
    <>
      <DeleteBuildingModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        buildingId={buildingToDelete?.building.id || ''}
        buildingName={buildingToDelete?.building.name || ''}
        onConfirm={handleConfirmDelete}
      />
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Buildings ({formData.buildings.length})
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Add buildings to this property. Each property can contain multiple buildings.
          </p>
        </div>
        {!isAddingNew && editingIndex === null && (
          <button
            type="button"
            onClick={handleAddBuilding}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-buena-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-buena-green/90"
          >
            <Plus className="h-4 w-4" />
            Add Building
          </button>
        )}
      </div>

      {/* Building Form (Add New Only) */}
      {isAddingNew && editingIndex === -1 && (
        <BuildingForm
          building={currentBuilding}
          buildingTypes={buildingTypes}
          onSave={handleSaveBuilding}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Buildings List */}
      {formData.buildings.length > 0 && (
        <div className="space-y-4">
          {formData.buildings.map((building, index) => (
            <div
              key={building.id}
              className="border rounded-lg p-4 bg-card"
            >
              {editingIndex === index ? (
                <BuildingForm
                  building={building}
                  buildingTypes={buildingTypes}
                  onSave={handleSaveBuilding}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{building.name || building.code || 'Unnamed Building'}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {building.buildingType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{building.street} {building.houseNumber}, {building.postalCode} {building.city}</p>
                      <p>
                        {building.constructionYear && `Construction year: ${building.constructionYear}`}
                        {building.constructionYear && building.floors && ' • '}
                        {building.floors && `Floors: ${building.floors}`}
                        {(building.constructionYear || building.floors) && ' • '}
                        {building.hasElevator ? 'Has elevator' : 'No elevator'}
                        {building.isBarrierFree && ' • Barrier-free'}
                      </p>
                      {building.description && (
                        <p className="text-xs mt-2">{building.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleEditBuilding(index)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Edit building"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(index)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete building"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {formData.buildings.length === 0 && !isAddingNew && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No buildings added yet. Click &quot;Add Building&quot; to get started.
          </p>
        </div>
      )}
      </div>
    </>
  )
}

interface BuildingFormProps {
  building: Building | null
  buildingTypes: { value: BuildingType; label: string }[]
  onSave: (building: Omit<Building, 'id'>) => void
  onCancel: () => void
}

function BuildingForm({ building, buildingTypes, onSave, onCancel }: BuildingFormProps) {
  const [formData, setFormData] = useState<Omit<Building, 'id'>>({
    code: building?.code || '',
    name: building?.name || '',
    street: building?.street || '',
    houseNumber: building?.houseNumber || '',
    postalCode: building?.postalCode || '',
    city: building?.city || '',
    constructionYear: building?.constructionYear || '',
    floors: building?.floors || '',
    hasElevator: building?.hasElevator || false,
    isBarrierFree: building?.isBarrierFree || false,
    buildingType: building?.buildingType || 'RESIDENTIAL',
    parkingAccess: building?.parkingAccess || '',
    description: building?.description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">
          {building ? 'Edit Building' : 'Add New Building'}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Building Code
            </label>
            <input
              type="text"
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="Building code"
            />
          </div>
        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
              Building Name
          </label>
          <input
            type="text"
              value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="e.g., Haus A - Parkside"
          />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Street <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="Street name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              House Number <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.houseNumber}
              onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="House number"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Postal Code <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="Postal code"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              City <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="City"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Construction Year
            </label>
            <input
              type="text"
              value={formData.constructionYear || ''}
              onChange={(e) => setFormData({ ...formData, constructionYear: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="e.g., 2023"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Number of Floors
            </label>
            <input
              type="text"
              value={formData.floors || ''}
              onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="e.g., 5"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Building Type <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.buildingType}
              onChange={(e) => setFormData({ ...formData, buildingType: e.target.value as BuildingType })}
              className="w-full h-11 pl-4 pr-10 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              }}
              required
            >
              {buildingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            <input
              type="checkbox"
              checked={formData.hasElevator}
              onChange={(e) => setFormData({ ...formData, hasElevator: e.target.checked })}
              className="mr-2"
            />
            Has Elevator
          </label>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              <input
                type="checkbox"
                checked={formData.isBarrierFree}
                onChange={(e) => setFormData({ ...formData, isBarrierFree: e.target.checked })}
                className="mr-2"
              />
              Is Barrier-Free
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Parking Access
          </label>
          <input
            type="text"
            value={formData.parkingAccess || ''}
            onChange={(e) => setFormData({ ...formData, parkingAccess: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="Parking access information"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm min-h-[80px] resize-y"
            placeholder="Additional details about the building (optional)"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-foreground border border-input rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-buena-green rounded-lg hover:bg-buena-green/90 transition-colors"
        >
          <Check className="h-4 w-4 inline mr-2" />
          {building ? 'Save Changes' : 'Add Building'}
        </button>
      </div>
    </form>
  )
}
