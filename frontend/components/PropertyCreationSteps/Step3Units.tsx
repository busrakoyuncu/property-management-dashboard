'use client'

import React, { useState } from 'react'
import { StepComponentProps, Unit, UnitType } from '@/types/propertyForm'
import { Plus, Trash2, Edit2, X, Check, Table, List, Upload, Sparkles } from 'lucide-react'
import { DeleteUnitModal } from '../DeleteUnitModal'
import { UnitsTable } from './Step3UnitsTable'
import { BulkUnitImport } from './BulkUnitImport'
import { BulkUnitPattern } from './BulkUnitPattern'
import { QuickAddUnit } from './QuickAddUnit'
import { Button } from '@/components/ui/button'

type ViewMode = 'list' | 'table'

export function Step3Units({ formData, onUpdate, onEditingChange }: StepComponentProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<{ index: number; unit: Unit } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [showBulkPattern, setShowBulkPattern] = useState(false)
  const [quickAddMode, setQuickAddMode] = useState(false)

  // Notify parent when editing state changes
  React.useEffect(() => {
    const isEditing = isAddingNew || editingIndex !== null
    onEditingChange?.(isEditing)
  }, [isAddingNew, editingIndex, onEditingChange])

  const unitTypes: { value: UnitType; label: string }[] = [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'OFFICE', label: 'Office' },
    { value: 'PARKING', label: 'Parking' },
    { value: 'GARDEN', label: 'Garden' },
  ]

  const handleAddUnit = () => {
    setIsAddingNew(true)
    setEditingIndex(-1) // Use -1 to indicate new unit
  }

  const handleEditUnit = (index: number) => {
    setEditingIndex(index)
    setIsAddingNew(false)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setIsAddingNew(false)
  }

  const handleDeleteClick = (index: number) => {
    setUnitToDelete({ index, unit: formData.units[index] })
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (unitToDelete) {
      const updatedUnits = formData.units.filter((_, i) => i !== unitToDelete.index)
      onUpdate({ units: updatedUnits })
      setUnitToDelete(null)
    }
  }

  const handleSaveUnit = (unitData: Omit<Unit, 'id'>) => {
    const units = [...formData.units]
    
    if (editingIndex === -1) {
      // Adding new unit
      const newUnit: Unit = {
        ...unitData,
        id: `unit-${Date.now()}`, // Simple ID generation
      }
      units.push(newUnit)
    } else if (editingIndex !== null) {
      // Editing existing unit
      units[editingIndex] = {
        ...units[editingIndex],
        ...unitData,
      }
    }
    
    onUpdate({ units })
    handleCancelEdit()
  }

  const handleBulkImport = (importedUnits: Omit<Unit, 'id'>[]) => {
    const newUnits: Unit[] = importedUnits.map((unit, idx) => ({
      ...unit,
      id: `unit-${Date.now()}-${idx}`,
    }))
    onUpdate({ units: [...formData.units, ...newUnits] })
  }

  const handleBulkPattern = (generatedUnits: Omit<Unit, 'id'>[]) => {
    const newUnits: Unit[] = generatedUnits.map((unit, idx) => ({
      ...unit,
      id: `unit-${Date.now()}-${idx}`,
    }))
    onUpdate({ units: [...formData.units, ...newUnits] })
  }

  const handleDuplicate = (unit: Unit) => {
    const duplicated: Unit = {
      ...unit,
      id: `unit-${Date.now()}`,
      unitNumber: `${unit.unitNumber}-copy`,
    }
    onUpdate({ units: [...formData.units, duplicated] })
  }

  const handleTableUpdate = (updatedUnits: Unit[]) => {
    onUpdate({ units: updatedUnits })
  }

  const handleTableEdit = (unit: Unit, index: number) => {
    handleEditUnit(index)
    // Switch to list view to show the edit form
    setViewMode('list')
  }

  const handleTableDelete = (index: number) => {
    handleDeleteClick(index)
  }

  const currentUnit = editingIndex !== null && editingIndex >= 0 
    ? formData.units[editingIndex] 
    : null

  const getBuildingName = (buildingId: string) => {
    const building = formData.buildings.find(b => b.id === buildingId)
    if (!building) return buildingId
    return building.name || building.code || 'Unnamed Building'
  }

  return (
    <>
      <DeleteUnitModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        unitId={unitToDelete?.unit.id || ''}
        unitNumber={unitToDelete?.unit.unitNumber || ''}
        unitType={unitToDelete?.unit.unitType}
        onConfirm={handleConfirmDelete}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Units ({formData.units.length})
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add units to buildings. Supported types: Apartment, Office, Garden, Parking
            </p>
          </div>
          {!isAddingNew && editingIndex === null && !showBulkImport && !showBulkPattern && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 border rounded-lg p-1 bg-background">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-brand-green text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Table className="h-3 w-3 inline mr-1" />
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-brand-green text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="h-3 w-3 inline mr-1" />
                  List
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBulkPattern(true)}
                className="rounded-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Pattern
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBulkImport(true)}
                className="rounded-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button
                type="button"
                onClick={() => setQuickAddMode(true)}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
              <Button
                type="button"
                onClick={handleAddUnit}
                className="rounded-full bg-brand-green hover:bg-brand-green/90"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Full Form
              </Button>
            </div>
          )}
        </div>

        {/* Bulk Import */}
        {showBulkImport && (
          <BulkUnitImport
            buildings={formData.buildings}
            onImport={handleBulkImport}
            onCancel={() => setShowBulkImport(false)}
          />
        )}

        {/* Bulk Pattern */}
        {showBulkPattern && (
          <BulkUnitPattern
            buildings={formData.buildings}
            onGenerate={handleBulkPattern}
            onCancel={() => setShowBulkPattern(false)}
          />
        )}

        {/* Quick Add Mode */}
        {quickAddMode && !isAddingNew && editingIndex === null && (
          <QuickAddUnit
            buildings={formData.buildings}
            lastUnit={formData.units[formData.units.length - 1]}
            onSave={(unitData) => {
              const newUnit: Unit = {
                ...unitData,
                id: `unit-${Date.now()}`,
              }
              onUpdate({ units: [...formData.units, newUnit] })
              // Form stays open for next unit
            }}
            onCancel={() => setQuickAddMode(false)}
          />
        )}

        {/* Unit Form (Add New Only) - Show at top when adding new */}
        {isAddingNew && editingIndex === -1 && (
          <div className="mb-6">
            <UnitForm
              unit={currentUnit}
              unitTypes={unitTypes}
              buildings={formData.buildings}
              onSave={(unitData) => {
                handleSaveUnit(unitData)
                setQuickAddMode(false)
              }}
              onCancel={() => {
                handleCancelEdit()
                setQuickAddMode(false)
              }}
            />
          </div>
        )}

        {/* Units Table View */}
        {viewMode === 'table' && formData.units.length > 0 && !showBulkImport && !showBulkPattern && !isAddingNew && editingIndex === null && (
          <UnitsTable
            units={formData.units}
            buildings={formData.buildings}
            onUpdate={handleTableUpdate}
            onEdit={handleTableEdit}
            onDelete={handleTableDelete}
            onDuplicate={handleDuplicate}
          />
        )}

        {/* Units List View */}
        {viewMode === 'list' && formData.units.length > 0 && !showBulkImport && !showBulkPattern && !quickAddMode && !isAddingNew && (
          <div className="space-y-4">
            {formData.units.map((unit, index) => (
              <div
                key={unit.id}
                className="border rounded-lg p-4 bg-card"
              >
                {editingIndex === index ? (
                  <UnitForm
                    unit={unit}
                    unitTypes={unitTypes}
                    buildings={formData.buildings}
                    onSave={handleSaveUnit}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">Unit {unit.unitNumber}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {unit.unitType.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Building: {getBuildingName(unit.buildingId)}</p>
                        <p>
                          {unit.floor && `Floor: ${unit.floor}`}
                          {unit.floor && unit.entrance && ' • '}
                          {unit.entrance && `Entrance: ${unit.entrance}`}
                          {unit.position && (unit.floor || unit.entrance) && ' • '}
                          {unit.position && `Position: ${unit.position}`}
                          {unit.sizeSqm && (unit.floor || unit.entrance || unit.position) && ' • '}
                          {unit.sizeSqm && `Size: ${unit.sizeSqm} m²`}
                          {(unit.floor || unit.entrance || unit.position || unit.sizeSqm) && ' • '}
                          {unit.rooms && unit.rooms !== '0' ? `Rooms: ${unit.rooms}` : '- rooms'}
                        </p>
                        <p>
                          MEA share: {unit.meaShare}
                          {unit.constructionYear && ` • Construction year: ${unit.constructionYear}`}
                          {unit.parkingNumber && ` • Parking: ${unit.parkingNumber}`}
                        </p>
                        {unit.description && (
                          <p className="text-xs mt-2">{unit.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => handleEditUnit(index)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Edit unit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(index)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete unit"
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

        {formData.units.length === 0 && !isAddingNew && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No units added yet. Click &quot;Add Unit&quot; to get started.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

interface UnitFormProps {
  unit: Unit | null
  unitTypes: { value: UnitType; label: string }[]
  buildings: Array<{ id: string; name?: string; code?: string }>
  onSave: (unit: Omit<Unit, 'id'>) => void
  onCancel: () => void
}

function UnitForm({ unit, unitTypes, buildings, onSave, onCancel }: UnitFormProps) {
  const [formData, setFormData] = useState<Omit<Unit, 'id'>>({
    unitNumber: unit?.unitNumber || '',
    unitType: unit?.unitType || 'APARTMENT',
    parkingNumber: unit?.parkingNumber || '',
    buildingId: unit?.buildingId || (buildings.length > 0 ? buildings[0].id : ''),
    floor: unit?.floor || '',
    entrance: unit?.entrance || '',
    position: unit?.position || '',
    sizeSqm: unit?.sizeSqm || '',
    rooms: unit?.rooms || '',
    meaShare: unit?.meaShare || '',
    constructionYear: unit?.constructionYear || '',
    description: unit?.description || '',
    specialUseRights: unit?.specialUseRights || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">
          {unit ? 'Edit Unit' : 'Add New Unit'}
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
              Unit Number <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.unitNumber}
              onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="e.g., 01, 02"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Unit Type <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.unitType}
              onChange={(e) => setFormData({ ...formData, unitType: e.target.value as UnitType })}
              className="w-full h-11 pl-4 pr-10 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              }}
              required
            >
              {unitTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Parking Number
          </label>
          <input
            type="text"
            value={formData.parkingNumber || ''}
            onChange={(e) => setFormData({ ...formData, parkingNumber: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="Parking number"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Building <span className="text-destructive">*</span>
          </label>
          <select
            value={formData.buildingId}
            onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
            className="w-full h-11 pl-4 pr-10 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            }}
            required
          >
            {buildings.length === 0 ? (
              <option value="">No buildings available</option>
            ) : (
              buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name || building.code || 'Unnamed Building'}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Floor
            </label>
            <input
              type="text"
              value={formData.floor || ''}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="e.g., Erdgeschoss, 1 Obergeschoss"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Entrance
            </label>
            <input
              type="text"
              value={formData.entrance || ''}
              onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="e.g., A, B"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Position
            </label>
            <input
              type="text"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="Position"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Size (m²)
            </label>
            <input
              type="text"
              value={formData.sizeSqm || ''}
              onChange={(e) => setFormData({ ...formData, sizeSqm: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="e.g., 95.00"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              MEA Share <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.meaShare}
              onChange={(e) => setFormData({ ...formData, meaShare: e.target.value })}
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="e.g., 110.0"
              required
            />
          </div>

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
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Rooms
          </label>
          <input
            type="text"
            value={formData.rooms || ''}
            onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="e.g., 3"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Special Use Rights
          </label>
          <input
            type="text"
            value={formData.specialUseRights || ''}
            onChange={(e) => setFormData({ ...formData, specialUseRights: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="Special use rights"
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
            placeholder="Additional details about the unit (optional)"
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
          className="px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-lg hover:bg-brand-green/90 transition-colors"
        >
          <Check className="h-4 w-4 inline mr-2" />
          {unit ? 'Save Changes' : 'Add Unit'}
        </button>
      </div>
    </form>
  )
}
