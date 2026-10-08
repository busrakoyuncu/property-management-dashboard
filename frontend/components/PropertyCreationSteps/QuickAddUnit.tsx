'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Unit, UnitType } from '@/types/propertyForm'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuickAddUnitProps {
  buildings: Array<{ id: string; name?: string; code?: string }>
  lastUnit?: Unit
  onSave: (unit: Omit<Unit, 'id'>) => void
  onCancel: () => void
}

export function QuickAddUnit({ buildings, lastUnit, onSave, onCancel }: QuickAddUnitProps) {
  const [formData, setFormData] = useState<Omit<Unit, 'id'>>({
    unitNumber: '',
    unitType: 'APARTMENT',
    parkingNumber: '',
    buildingId: lastUnit?.buildingId || (buildings.length > 0 ? buildings[0].id : ''),
    floor: lastUnit?.floor || '',
    entrance: lastUnit?.entrance || '',
    position: '',
    sizeSqm: '',
    rooms: '',
    meaShare: '',
    constructionYear: lastUnit?.constructionYear || '',
    description: '',
    specialUseRights: '',
  })

  const unitNumberRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    unitNumberRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.unitNumber && formData.meaShare) {
      onSave(formData)
      // Reset for next unit
      setFormData({
        ...formData,
        unitNumber: '',
        sizeSqm: '',
        rooms: '',
        meaShare: '',
        parkingNumber: '',
        position: '',
        description: '',
        specialUseRights: '',
      })
      unitNumberRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="border rounded-lg p-4 bg-muted/30 space-y-3"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-foreground text-sm">Quick Add Unit</h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="text-xs font-medium mb-1 block">Unit # <span className="text-destructive">*</span></label>
          <input
            ref={unitNumberRef}
            type="text"
            value={formData.unitNumber}
            onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
            className="w-full h-9 px-2 border border-input bg-background rounded text-sm"
            placeholder="01"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Type</label>
          <select
            value={formData.unitType}
            onChange={(e) => setFormData({ ...formData, unitType: e.target.value as UnitType })}
            className="w-full h-9 px-2 border border-input bg-background rounded text-sm"
          >
            <option value="APARTMENT">Apt</option>
            <option value="OFFICE">Office</option>
            <option value="PARKING">Parking</option>
            <option value="GARDEN">Garden</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Building</label>
          <select
            value={formData.buildingId}
            onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
            className="w-full h-9 px-2 border border-input bg-background rounded text-sm"
          >
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name || b.code || 'Unnamed'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">MEA <span className="text-destructive">*</span></label>
          <input
            type="text"
            value={formData.meaShare}
            onChange={(e) => setFormData({ ...formData, meaShare: e.target.value })}
            className="w-full h-9 px-2 border border-input bg-background rounded text-sm"
            placeholder="110.0"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          className="bg-brand-green hover:bg-brand-green/90 text-white"
        >
          <Check className="h-3 w-3 mr-1" />
          Add & Continue
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Done
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">
          Press Enter to save, Esc to cancel
        </span>
      </div>
    </form>
  )
}
