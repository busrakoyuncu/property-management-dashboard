'use client'

import { useState } from 'react'
import { Property, PropertyListProps } from '@/types/property'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { DeletePropertyModal } from './DeletePropertyModal'
import { PropertyCreationModal } from './PropertyCreationModal'

export function PropertyDashboard({ properties, onCreateNew, onDelete }: PropertyListProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const toggleRow = (propertyId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId)
      } else {
        newSet.add(propertyId)
      }
      return newSet
    })
  }

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (propertyToDelete) {
      onDelete?.(propertyToDelete.id)
      setPropertyToDelete(null)
    }
  }

  const handleCreateClick = () => {
    setCreateModalOpen(true)
    onCreateNew?.()
  }

  const handleCreateComplete = (propertyData: any) => {
    // TODO: Handle property creation
    console.log('Property created:', propertyData)
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
            Hey Büşra you can manage and view all your properties here!
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
                    <>
                      <tr
                        key={property.id}
                        className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleRow(property.id)}
                      >
                        <td className="p-3 sm:p-6 align-middle font-medium text-sm sm:text-base">{property.name}</td>
                        <td className="p-3 sm:p-6 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs font-medium ${
                              property.type === 'WEG'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            <span className="hidden sm:inline">{property.type === 'WEG' ? 'Condominium(WEG)' : 'Rental(MV)'}</span>
                            <span className="sm:hidden">{property.type}</span>
                          </span>
                        </td>
                        <td className="p-3 sm:p-6 align-middle text-muted-foreground text-xs sm:text-sm hidden md:table-cell">
                          {property.uniqueNumber}
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
                        <tr key={`${property.id}-details`} className="border-b bg-muted/30">
                          <td colSpan={4} className="p-4 sm:p-6">
                            <div className="space-y-4">
                              <div className="mb-2 md:hidden">
                                <p className="text-xs text-muted-foreground mb-1">Unique Number</p>
                                <p className="text-sm font-medium">{property.uniqueNumber}</p>
                              </div>
                              <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Property Details</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Property ID</p>
                                  <p className="text-sm font-medium">{property.id}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Unique Number</p>
                                  <p className="text-sm font-medium">{property.uniqueNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                                  <p className="text-sm font-medium">
                                    {property.type === 'WEG' ? 'Condominium (WEG)' : 'Rental (MV)'}
                                  </p>
                                </div>
                                {property.createdAt && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Created At</p>
                                    <p className="text-sm font-medium">{property.createdAt}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
