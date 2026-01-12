'use client'

import React, { useState } from 'react'
import { Unit, UnitType } from '@/types/propertyForm'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkUnitImportProps {
  buildings: Array<{ id: string; name?: string; code?: string }>
  onImport: (units: Omit<Unit, 'id'>[]) => void
  onCancel: () => void
}

export function BulkUnitImport({ buildings, onImport, onCancel }: BulkUnitImportProps) {
  const [csvText, setCsvText] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [preview, setPreview] = useState<Omit<Unit, 'id'>[]>([])

  const parseCSV = (text: string): Omit<Unit, 'id'>[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const units: Omit<Unit, 'id'>[] = []
    const newErrors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      if (values.length !== headers.length) {
        newErrors.push(`Row ${i + 1}: Column count mismatch`)
        continue
      }

      const row: any = {}
      headers.forEach((header, idx) => {
        const lowerHeader = header.toLowerCase()
        const noSpaces = lowerHeader.replace(/\s+/g, '')
        const noSpecialChars = noSpaces.replace(/[()²]/g, '')
        const alphanumericOnly = lowerHeader.replace(/[^a-z0-9]/g, '')
        
        // Store value under multiple keys for matching
        row[lowerHeader] = values[idx]
        row[noSpaces] = values[idx]
        row[noSpecialChars] = values[idx]
        row[alphanumericOnly] = values[idx]
        // Also store original header for exact match
        row[header] = values[idx]
      })

      // Helper to find value by multiple possible keys (checks all variations)
      const getValue = (...keys: string[]): string => {
        for (const key of keys) {
          const value = row[key]
          if (value !== undefined && value !== null && value !== '') {
            return String(value).trim()
          }
        }
        return ''
      }

      // Helper to get rooms value, treating '0' as empty
      const getRoomsValue = (): string => {
        const value = getValue('rooms')
        return value === '0' ? '' : value
      }

      // Map CSV columns to unit fields with multiple fallback options
      const unit: Omit<Unit, 'id'> = {
        unitNumber: getValue('unitnumber', 'unit', 'unit#'),
        unitType: (getValue('unittype', 'type') || 'APARTMENT').toUpperCase() as UnitType,
        buildingId: buildings.find(b => 
          (b.name || b.code || '').toLowerCase() === (getValue('building') || '').toLowerCase()
        )?.id || buildings[0]?.id || '',
        floor: getValue('floor'),
        entrance: getValue('entrance'),
        position: getValue('position'),
        // Handle "Size (m²)" -> "sizem" after normalization, or "sizesqm", or "size"
        // Check all possible variations including normalized forms
        sizeSqm: getValue('sizesqm', 'sizem', 'size (m²)', 'size(m²)', 'size'),
        rooms: getRoomsValue(),
        // Handle "MEA Share" -> "meashare" after normalization
        meaShare: getValue('meashare', 'mea', 'mea share'),
        parkingNumber: getValue('parkingnumber', 'parking'),
        // Handle "Construction Year" -> "constructionyear" after normalization
        constructionYear: getValue('constructionyear', 'year', 'construction year'),
        description: getValue('description'),
        specialUseRights: getValue('specialuserights', 'rights', 'special use rights'),
      }

      if (!unit.unitNumber || !unit.meaShare) {
        newErrors.push(`Row ${i + 1}: Missing required fields (unitNumber, meaShare)`)
        continue
      }

      units.push(unit)
    }

    setErrors(newErrors)
    return units
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvText(text)
      const parsed = parseCSV(text)
      setPreview(parsed)
    }
    reader.readAsText(file)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setCsvText(text)
    if (text.trim()) {
      const parsed = parseCSV(text)
      setPreview(parsed)
    } else {
      setPreview([])
      setErrors([])
    }
  }

  const handleImport = () => {
    if (preview.length > 0 && errors.length === 0) {
      onImport(preview)
      onCancel()
    }
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">Bulk Import Units from CSV</h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Upload CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="w-full text-sm"
        />
        <p className="text-xs text-muted-foreground">
          CSV format: Unit Number, Type, Building, Floor, Entrance, Size (m²), Rooms, MEA Share, Parking, Construction Year
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Or Paste CSV Data</label>
        <textarea
          value={csvText}
          onChange={handleTextChange}
          className="w-full h-32 px-3 py-2 border border-input bg-background rounded-lg text-sm font-mono"
          placeholder="Unit Number,Type,Building,Floor,Entrance,Size (m²),Rooms,MEA Share,Parking,Construction Year&#10;01,APARTMENT,Building A,1,A,95.0,3,110.0,P1,2023&#10;02,APARTMENT,Building A,1,A,85.0,2,100.0,,2023"
        />
      </div>

      {errors.length > 0 && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive mb-1">Import Errors:</p>
              <ul className="text-xs text-destructive space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {preview.length > 0 && errors.length === 0 && (
        <div className="p-3 bg-buena-green/10 border border-buena-green/20 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-buena-green mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-buena-green">
                Ready to import {preview.length} units
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={preview.length === 0 || errors.length > 0}
          className="bg-buena-green hover:bg-buena-green/90"
        >
          Import {preview.length} Units
        </Button>
      </div>
    </div>
  )
}
