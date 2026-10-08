'use client'

import React, { useState } from 'react'
import { Unit, UnitType } from '@/types/propertyForm'
import { X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkUnitPatternProps {
  buildings: Array<{ id: string; name?: string; code?: string }>
  onGenerate: (units: Omit<Unit, 'id'>[]) => void
  onCancel: () => void
}

export function BulkUnitPattern({ buildings, onGenerate, onCancel }: BulkUnitPatternProps) {
  const [pattern, setPattern] = useState({
    count: 10,
    startNumber: 1,
    unitType: 'APARTMENT' as UnitType,
    buildingId: buildings[0]?.id || '',
    floor: '',
    entrance: '',
    sizeSqm: '',
    rooms: '',
    meaShare: '',
    constructionYear: '',
    incrementUnitNumber: true,
    incrementFloor: false,
  })

  const handleGenerate = () => {
    const units: Omit<Unit, 'id'>[] = []
    
    for (let i = 0; i < pattern.count; i++) {
      const unitNumber = pattern.incrementUnitNumber
        ? String(pattern.startNumber + i).padStart(2, '0')
        : String(pattern.startNumber).padStart(2, '0')
      
      const floor = pattern.incrementFloor && pattern.floor
        ? `${pattern.floor} ${i + 1}`
        : pattern.floor

      units.push({
        unitNumber,
        unitType: pattern.unitType,
        buildingId: pattern.buildingId,
        floor,
        entrance: pattern.entrance,
        position: '',
        sizeSqm: pattern.sizeSqm,
        rooms: pattern.rooms,
        meaShare: pattern.meaShare || '0',
        parkingNumber: '',
        constructionYear: pattern.constructionYear,
        description: '',
        specialUseRights: '',
      })
    }

    onGenerate(units)
    onCancel()
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-yellow" />
          <h4 className="font-semibold text-foreground">Generate Units from Pattern</h4>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Number of Units</label>
          <input
            type="number"
            min="1"
            max="200"
            value={pattern.count}
            onChange={(e) => setPattern({ ...pattern, count: parseInt(e.target.value) || 1 })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Start Unit Number</label>
          <input
            type="number"
            min="1"
            value={pattern.startNumber}
            onChange={(e) => setPattern({ ...pattern, startNumber: parseInt(e.target.value) || 1 })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Unit Type</label>
          <select
            value={pattern.unitType}
            onChange={(e) => setPattern({ ...pattern, unitType: e.target.value as UnitType })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
          >
            <option value="APARTMENT">Apartment</option>
            <option value="OFFICE">Office</option>
            <option value="PARKING">Parking</option>
            <option value="GARDEN">Garden</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Building</label>
          <select
            value={pattern.buildingId}
            onChange={(e) => setPattern({ ...pattern, buildingId: e.target.value })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
          >
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name || b.code || 'Unnamed'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Floor</label>
          <input
            type="text"
            value={pattern.floor}
            onChange={(e) => setPattern({ ...pattern, floor: e.target.value })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
            placeholder="e.g., 1. Obergeschoss"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Entrance</label>
          <input
            type="text"
            value={pattern.entrance}
            onChange={(e) => setPattern({ ...pattern, entrance: e.target.value })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
            placeholder="e.g., A"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Size (m²)</label>
          <input
            type="text"
            value={pattern.sizeSqm}
            onChange={(e) => setPattern({ ...pattern, sizeSqm: e.target.value })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
            placeholder="e.g., 95.0"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Rooms</label>
          <input
            type="text"
            value={pattern.rooms}
            onChange={(e) => setPattern({ ...pattern, rooms: e.target.value })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
            placeholder="e.g., 3"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">MEA Share <span className="text-destructive">*</span></label>
          <input
            type="text"
            value={pattern.meaShare}
            onChange={(e) => setPattern({ ...pattern, meaShare: e.target.value })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
            placeholder="e.g., 110.0"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Construction Year</label>
          <input
            type="text"
            value={pattern.constructionYear}
            onChange={(e) => setPattern({ ...pattern, constructionYear: e.target.value })}
            className="w-full h-9 px-3 border border-input bg-background rounded-lg text-sm"
            placeholder="e.g., 2023"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={pattern.incrementUnitNumber}
            onChange={(e) => setPattern({ ...pattern, incrementUnitNumber: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Auto-increment unit numbers (01, 02, 03...)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={pattern.incrementFloor}
            onChange={(e) => setPattern({ ...pattern, incrementFloor: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Increment floor numbers</span>
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={!pattern.meaShare || !pattern.buildingId}
          className="bg-brand-green hover:bg-brand-green/90"
        >
          Generate {pattern.count} Units
        </Button>
      </div>
    </div>
  )
}
