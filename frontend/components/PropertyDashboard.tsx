'use client'

import React, { useState } from 'react'
import { Property, useDeletePropertyMutation } from '@/lib/store/api/properties'
import { useGetBuildingsQuery, Building } from '@/lib/store/api/buildings'
import { useGetUnitsQuery } from '@/lib/store/api/units'
import { Plus, Trash2, ChevronDown, ChevronUp, Building2 } from 'lucide-react'
import { DeletePropertyModal } from './DeletePropertyModal'
import { PropertyCreationModal } from './PropertyCreationModal'

interface PropertyListProps {
  properties: Property[]
  onCreateNew?: () => void
  onDelete?: (id: string) => void
}

// Component to display units for a building
function BuildingUnits({ buildingId }: { buildingId: string }) {
  const { data: units, isLoading } = useGetUnitsQuery(buildingId, { skip: !buildingId })

  if (isLoading) {
    return <div className="text-xs text-muted-foreground py-3 px-4">Loading units...</div>
  }

  if (!units || units.length === 0) {
    return <div className="text-xs text-muted-foreground py-3 px-4">No units</div>
  }

  return (
    <div className="px-3 pb-3 space-y-2">
      {units.map((unit) => (
        <div
          key={unit.id}
          className="p-3 bg-muted/30 rounded-lg border"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">Unit {unit.unitNumber}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-background text-muted-foreground">
              {unit.unitType}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unit.floor && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                Floor: {unit.floor}
              </span>
            )}
            {unit.entrance && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                Entrance: {unit.entrance}
              </span>
            )}
            {unit.sizeSqm && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                {unit.sizeSqm} m²
              </span>
            )}
            {unit.rooms && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                {unit.rooms} rooms
              </span>
            )}
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
              MEA: {unit.meaShare}
            </span>
            {unit.parkingNumber && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                Parking: {unit.parkingNumber}
              </span>
            )}
            {unit.position && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                Position: {unit.position}
              </span>
            )}
            {unit.constructionYear && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                Built: {unit.constructionYear}
              </span>
            )}
          </div>
          {unit.description && (
            <p className="text-xs text-muted-foreground mt-2">{unit.description}</p>
          )}
          {unit.specialUseRights && (
            <p className="text-xs text-muted-foreground mt-1">Special Use Rights: {unit.specialUseRights}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// Component to display a building with expandable units
function BuildingCard({ building, isExpanded, onToggle }: { building: Building; isExpanded: boolean; onToggle: (buildingId: string) => void }) {
  return (
    <div className="bg-background rounded-lg border">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle(building.id)
        }}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex-1">
          <p className="font-medium text-sm mb-1">
            {building.name || building.code || 'Unnamed Building'}
          </p>
          <p className="text-xs text-muted-foreground">
            {building.street} {building.houseNumber}, {building.postalCode} {building.city}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
              {building.buildingType}
            </span>
            {building.floors && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                {building.floors} floors
              </span>
            )}
            {building.constructionYear && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                Built {building.constructionYear}
              </span>
            )}
            {building.hasElevator && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                Elevator
              </span>
            )}
            {building.isBarrierFree && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                Barrier-free
              </span>
            )}
          </div>
          {building.parkingAccess && (
            <p className="text-xs text-muted-foreground mt-1">Parking: {building.parkingAccess}</p>
          )}
          {building.description && (
            <p className="text-xs text-muted-foreground mt-1">{building.description}</p>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isExpanded && <BuildingUnits buildingId={building.id} />}
    </div>
  )
}

export function PropertyDashboard({ properties, onCreateNew, onDelete }: PropertyListProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set())
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation()
  const { data: buildings } = useGetBuildingsQuery(
    expandedRows.size > 0 ? Array.from(expandedRows)[0] : undefined,
    { skip: expandedRows.size === 0 }
  )

  const toggleRow = (propertyId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId)
        // Clear expanded buildings when property is collapsed
        setExpandedBuildings(new Set())
      } else {
        newSet.clear() // Only one expanded at a time
        newSet.add(propertyId)
        // Clear expanded buildings when switching properties
        setExpandedBuildings(new Set())
      }
      return newSet
    })
  }

  const toggleBuilding = (buildingId: string) => {
    setExpandedBuildings((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(buildingId)) {
        newSet.delete(buildingId)
      } else {
        newSet.add(buildingId)
      }
      return newSet
    })
  }

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (propertyToDelete && !isDeleting) {
      try {
        await deleteProperty(propertyToDelete.id).unwrap()
        setPropertyToDelete(null)
        setDeleteModalOpen(false)
      } catch (err) {
        console.error('Failed to delete property:', err)
      }
    }
  }

  const handleCreateClick = () => {
    setCreateModalOpen(true)
    onCreateNew?.()
  }

  const handleCreateComplete = () => {
    setCreateModalOpen(false)
    // Properties list will automatically refresh via RTK Query
  }
  return (
    <div className="space-y-6">
      <DeletePropertyModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        propertyId={propertyToDelete?.id || ''}
        propertyName={propertyToDelete?.name}
        onConfirm={handleConfirmDelete}
      />
      <PropertyCreationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onComplete={handleCreateComplete}
      />
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground">Property Management Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            You can manage and view all your properties here!
          </p>
        </div>
        {properties.length > 0 && (
          <button
            onClick={handleCreateClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-buena-green px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white transition-colors hover:bg-buena-green/95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create new property</span>
            <span className="sm:hidden">Create property</span>
          </button>
        )}
      </div>

      {/* Properties Table */}
      <div className="rounded-lg border bg-card">
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first property
            </p>
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-buena-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-buena-green/95"
            >
              <Plus className="h-4 w-4" />
              Create new property
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-3 sm:px-6 text-left align-middle font-medium text-muted-foreground text-xs sm:text-sm">
                    Property Name
                  </th>
                  <th className="h-12 px-3 sm:px-6 text-left align-middle font-medium text-muted-foreground text-xs sm:text-sm">
                    Type
                  </th>
                  <th className="h-12 px-3 sm:px-6 text-left align-middle font-medium text-muted-foreground text-xs sm:text-sm hidden md:table-cell">
                    Unique Number
                  </th>
                  <th className="h-12 pr-3 sm:pr-8 text-right align-middle font-medium text-muted-foreground w-20 text-xs sm:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => {
                  const isExpanded = expandedRows.has(property.id)
                  return (
                    <React.Fragment key={property.id}>
                      <tr
                        className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleRow(property.id)}
                      >
                        <td className="p-3 sm:p-6 align-middle font-medium text-sm sm:text-base">{property.name}</td>
                        <td className="p-3 sm:p-6 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs font-medium ${
                              property.managementType === 'WEG'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            <span className="hidden sm:inline">{property.managementType === 'WEG' ? 'Condominium(WEG)' : 'Rental(MV)'}</span>
                            <span className="sm:hidden">{property.managementType}</span>
                          </span>
                        </td>
                        <td className="p-3 sm:p-6 align-middle text-muted-foreground text-xs sm:text-sm hidden md:table-cell">
                          {property.propertyNumber}
                        </td>
                    <td className="p-3 sm:p-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(property)
                          }}
                          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:cursor-pointer"
                          aria-label={`Delete ${property.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleRow(property.id)
                          }}
                          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[#a6a09b] focus:ring-offset-2"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b bg-muted/30">
                          <td colSpan={4} className="p-4 sm:p-6">
                            <div className="space-y-4">
                              <div className="mb-2 md:hidden">
                                <p className="text-xs text-muted-foreground mb-1">Property Number</p>
                                <p className="text-sm font-medium">{property.propertyNumber}</p>
                              </div>
                              <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Property Details
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Property Number</p>
                                  <p className="text-sm font-medium">{property.propertyNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Management Type</p>
                                  <p className="text-sm font-medium">
                                    {property.managementType === 'WEG' ? 'Condominium (WEG)' : 'Rental (MV)'}
                                  </p>
                                </div>
                                {property.totalAreaSqm && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Total Area</p>
                                    <p className="text-sm font-medium">{property.totalAreaSqm} m²</p>
                                  </div>
                                )}
                                {property.totalMea && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Total MEA</p>
                                    <p className="text-sm font-medium">{property.totalMea}</p>
                                  </div>
                                )}
                                {property.landRegistryDistrict && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Land Registry District</p>
                                    <p className="text-sm font-medium">{property.landRegistryDistrict}</p>
                                  </div>
                                )}
                                {property.landRegistrySheet && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Land Registry Sheet</p>
                                    <p className="text-sm font-medium">{property.landRegistrySheet}</p>
                                  </div>
                                )}
                                {property.cadastralDistrict && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Cadastral District</p>
                                    <p className="text-sm font-medium">{property.cadastralDistrict}</p>
                                  </div>
                                )}
                                {property.cadastralParcel && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Cadastral Parcel</p>
                                    <p className="text-sm font-medium">{property.cadastralParcel}</p>
                                  </div>
                                )}
                                {property.cadastralPlot && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Cadastral Plot</p>
                                    <p className="text-sm font-medium">{property.cadastralPlot}</p>
                                  </div>
                                )}
                                {property.notaryReference && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Notary Reference</p>
                                    <p className="text-sm font-medium">{property.notaryReference}</p>
                                  </div>
                                )}
                                {property.declarationDate && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Declaration Date</p>
                                    <p className="text-sm font-medium">{new Date(property.declarationDate).toLocaleDateString()}</p>
                                  </div>
                                )}
                                {property.energyStandard && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Energy Standard</p>
                                    <p className="text-sm font-medium">{property.energyStandard}</p>
                                  </div>
                                )}
                                {property.heatingType && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Heating Type</p>
                                    <p className="text-sm font-medium">{property.heatingType}</p>
                                  </div>
                                )}
                                {property.originalOwner && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Original Owner</p>
                                    <p className="text-sm font-medium">{property.originalOwner}</p>
                                  </div>
                                )}
                                {property.propertyManager && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Property Manager</p>
                                    <p className="text-sm font-medium">{property.propertyManager.companyName}</p>
                                  </div>
                                )}
                                {property.accountant && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Accountant</p>
                                    <p className="text-sm font-medium">{property.accountant.companyName}</p>
                                  </div>
                                )}
                                {property.managerAppointmentYears && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Manager Appointment Years</p>
                                    <p className="text-sm font-medium">{property.managerAppointmentYears}</p>
                                  </div>
                                )}
                              </div>

                              {/* Buildings Section */}
                              {buildings && buildings.length > 0 && (
                                <div className="mt-6 pt-4 border-t">
                                  <h5 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Buildings ({buildings.length})
                                  </h5>
                                  <div className="space-y-2">
                                    {buildings.map((building) => (
                                      <BuildingCard
                                        key={building.id}
                                        building={building}
                                        isExpanded={expandedBuildings.has(building.id)}
                                        onToggle={toggleBuilding}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
