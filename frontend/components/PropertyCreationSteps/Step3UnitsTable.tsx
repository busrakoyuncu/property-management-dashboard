'use client'

import React, { useState, useMemo } from 'react'
import { Unit, UnitType } from '@/types/propertyForm'
import { Edit2, Trash2, Copy, Download} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UnitsTableProps {
  units: Unit[]
  buildings: Array<{ id: string; name?: string; code?: string }>
  onUpdate: (units: Unit[]) => void
  onEdit: (unit: Unit, index: number) => void
  onDelete: (index: number) => void
  onDuplicate: (unit: Unit) => void
}

export function UnitsTable({
  units,
  buildings,
  onUpdate,
  onEdit,
  onDelete,
  onDuplicate,
}: UnitsTableProps) {
  const [selectedUnits, setSelectedUnits] = useState<Set<number>>(new Set())
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null)
  const [filter, setFilter] = useState<{ buildingId?: string; unitType?: UnitType }>({})

  const getBuildingName = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId)
    return building?.name || building?.code || 'Unknown'
  }

  // Filter and sort units
  const processedUnits = useMemo(() => {
    let filtered = units.filter((unit, index) => {
      if (filter.buildingId && unit.buildingId !== filter.buildingId) return false
      if (filter.unitType && unit.unitType !== filter.unitType) return false
      return true
    })

    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.field as keyof Unit] || ''
        const bVal = b[sortConfig.field as keyof Unit] || ''
        const comparison = String(aVal).localeCompare(String(bVal))
        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }, [units, filter, sortConfig])

  const handleSort = (field: string) => {
    setSortConfig((current) => {
      if (current?.field === field) {
        return { field, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { field, direction: 'asc' }
    })
  }

  const handleSelectAll = () => {
    if (selectedUnits.size === processedUnits.length) {
      setSelectedUnits(new Set())
    } else {
      setSelectedUnits(new Set(processedUnits.map((_, i) => i)))
    }
  }

  const handleSelectUnit = (index: number) => {
    const newSelected = new Set(selectedUnits)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedUnits(newSelected)
  }

  const handleBulkDelete = () => {
    const indicesToDelete = Array.from(selectedUnits)
    // Get actual indices in original units array
    const actualIndices = indicesToDelete
      .map(index => units.findIndex(u => u.id === processedUnits[index].id))
      .filter(idx => idx !== -1)
      .sort((a, b) => b - a) // Sort descending to delete from end
    
    // Delete one at a time (onDelete expects single index)
    actualIndices.forEach(actualIndex => {
      onDelete(actualIndex)
    })
    setSelectedUnits(new Set())
  }

  const handleBulkUpdate = (field: string, value: string) => {
    const selectedUnitIds = new Set(
      Array.from(selectedUnits).map(index => processedUnits[index].id)
    )
    const updatedUnits = units.map(unit => {
      if (selectedUnitIds.has(unit.id)) {
        return { ...unit, [field]: value }
      }
      return unit
    })
    onUpdate(updatedUnits)
    setSelectedUnits(new Set())
  }

  const handleCellEdit = (rowIndex: number, field: string, currentValue: string) => {
    setEditingCell({ row: rowIndex, field })
    setEditValue(String(currentValue || ''))
  }

  const handleCellSave = () => {
    if (editingCell) {
      const actualIndex = units.findIndex(u => u.id === processedUnits[editingCell.row].id)
      if (actualIndex !== -1) {
        const updatedUnits = [...units]
        updatedUnits[actualIndex] = {
          ...updatedUnits[actualIndex],
          [editingCell.field]: editValue,
        }
        onUpdate(updatedUnits)
      }
    }
    setEditingCell(null)
    setEditValue('')
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, field: string) => {
    if (e.key === 'Enter') {
      handleCellSave()
    } else if (e.key === 'Escape') {
      handleCellCancel()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      handleCellSave()
      // Move to next cell
      const fields = ['unitNumber', 'unitType', 'buildingId', 'floor', 'sizeSqm', 'meaShare']
      const currentFieldIndex = fields.indexOf(field)
      if (currentFieldIndex < fields.length - 1) {
        const nextField = fields[currentFieldIndex + 1]
        handleCellEdit(rowIndex, nextField, processedUnits[rowIndex][nextField as keyof Unit] as string)
      }
    }
  }

  const exportToCSV = () => {
    const headers = ['Unit Number', 'Type', 'Building', 'Floor', 'Entrance', 'Size (m²)', 'Rooms', 'MEA Share', 'Parking', 'Construction Year']
    const rows = units.map(unit => [
      unit.unitNumber,
      unit.unitType,
      getBuildingName(unit.buildingId),
      unit.floor || '',
      unit.entrance || '',
      unit.sizeSqm || '',
      unit.rooms && unit.rooms !== '0' ? unit.rooms : '',
      unit.meaShare,
      unit.parkingNumber || '',
      unit.constructionYear || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `units-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <select
            value={filter.buildingId || ''}
            onChange={(e) => setFilter({ ...filter, buildingId: e.target.value || undefined })}
            className="h-9 px-3 border border-input bg-background rounded-lg text-sm"
          >
            <option value="">All Buildings</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name || b.code || 'Unnamed'}</option>
            ))}
          </select>
          <select
            value={filter.unitType || ''}
            onChange={(e) => setFilter({ ...filter, unitType: e.target.value as UnitType || undefined })}
            className="h-9 px-3 border border-input bg-background rounded-lg text-sm"
          >
            <option value="">All Types</option>
            <option value="APARTMENT">Apartment</option>
            <option value="OFFICE">Office</option>
            <option value="PARKING">Parking</option>
            <option value="GARDEN">Garden</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          {selectedUnits.size > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const value = prompt('Enter value for all selected units:')
                  if (value !== null) {
                    const field = prompt('Enter field name (e.g., floor, entrance, buildingId):')
                    if (field) {
                      handleBulkUpdate(field, value)
                    }
                  }
                }}
              >
                Bulk Edit ({selectedUnits.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-destructive hover:text-destructive"
              >
                Delete ({selectedUnits.size})
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUnits.size === processedUnits.length && processedUnits.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th
                  className="p-2 text-left cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('unitNumber')}
                >
                  Unit #
                  {sortConfig?.field === 'unitNumber' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th
                  className="p-2 text-left cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('unitType')}
                >
                  Type
                  {sortConfig?.field === 'unitType' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th className="p-2 text-left">Building</th>
                <th className="p-2 text-left">Floor</th>
                <th className="p-2 text-left">Entrance</th>
                <th className="p-2 text-left">Size (m²)</th>
                <th className="p-2 text-left">Rooms</th>
                <th className="p-2 text-left">MEA Share</th>
                <th className="p-2 text-left">Parking</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedUnits.map((unit, rowIndex) => {
                const actualIndex = units.findIndex(u => u.id === unit.id)
                const isSelected = selectedUnits.has(rowIndex)
                return (
                  <tr
                    key={unit.id}
                    className={`border-t hover:bg-muted/30 ${isSelected ? 'bg-muted/50' : ''}`}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectUnit(rowIndex)}
                        className="rounded"
                      />
                    </td>
                    <td
                      className="p-2 cursor-pointer"
                      onClick={() => handleCellEdit(rowIndex, 'unitNumber', unit.unitNumber)}
                    >
                      {editingCell?.row === rowIndex && editingCell?.field === 'unitNumber' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 'unitNumber')}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : (
                        unit.unitNumber
                      )}
                    </td>
                    <td className="p-2">
                      {editingCell?.row === rowIndex && editingCell?.field === 'unitType' ? (
                        <select
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        >
                          <option value="APARTMENT">Apartment</option>
                          <option value="OFFICE">Office</option>
                          <option value="PARKING">Parking</option>
                          <option value="GARDEN">Garden</option>
                        </select>
                      ) : (
                        <span
                          className="cursor-pointer"
                          onClick={() => handleCellEdit(rowIndex, 'unitType', unit.unitType)}
                        >
                          {unit.unitType}
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {editingCell?.row === rowIndex && editingCell?.field === 'buildingId' ? (
                        <select
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        >
                          {buildings.map(b => (
                            <option key={b.id} value={b.id}>{b.name || b.code || 'Unnamed'}</option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className="cursor-pointer"
                          onClick={() => handleCellEdit(rowIndex, 'buildingId', unit.buildingId)}
                        >
                          {getBuildingName(unit.buildingId)}
                        </span>
                      )}
                    </td>
                    <td
                      className="p-2 cursor-pointer"
                      onClick={() => handleCellEdit(rowIndex, 'floor', unit.floor || '')}
                    >
                      {editingCell?.row === rowIndex && editingCell?.field === 'floor' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 'floor')}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : (
                        unit.floor || '-'
                      )}
                    </td>
                    <td
                      className="p-2 cursor-pointer"
                      onClick={() => handleCellEdit(rowIndex, 'entrance', unit.entrance || '')}
                    >
                      {editingCell?.row === rowIndex && editingCell?.field === 'entrance' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 'entrance')}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : (
                        unit.entrance || '-'
                      )}
                    </td>
                    <td
                      className="p-2 cursor-pointer"
                      onClick={() => handleCellEdit(rowIndex, 'sizeSqm', unit.sizeSqm || '')}
                    >
                      {editingCell?.row === rowIndex && editingCell?.field === 'sizeSqm' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 'sizeSqm')}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : (
                        unit.sizeSqm || '-'
                      )}
                    </td>
                    <td
                      className="p-2 cursor-pointer"
                      onClick={() => handleCellEdit(rowIndex, 'rooms', unit.rooms || '')}
                    >
                      {editingCell?.row === rowIndex && editingCell?.field === 'rooms' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 'rooms')}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : (
                        unit.rooms && unit.rooms !== '0' ? unit.rooms : '-'
                      )}
                    </td>
                    <td
                      className="p-2 cursor-pointer font-medium"
                      onClick={() => handleCellEdit(rowIndex, 'meaShare', unit.meaShare)}
                    >
                      {editingCell?.row === rowIndex && editingCell?.field === 'meaShare' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 'meaShare')}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : (
                        unit.meaShare
                      )}
                    </td>
                    <td className="p-2">{unit.parkingNumber || '-'}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onDuplicate(unit)}
                          className="p-1 hover:bg-muted rounded"
                          title="Duplicate"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(unit, actualIndex)}
                          className="p-1 hover:bg-muted rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(actualIndex)}
                          className="p-1 hover:bg-destructive/10 rounded text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {processedUnits.length} of {units.length} units. Click cells to edit inline. Use Tab to move between fields.
      </p>
    </div>
  )
}
