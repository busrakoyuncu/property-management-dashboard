'use client'

import { useState } from 'react'
import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ContactRole, CreateContactDto, useCreateContactMutation } from '@/lib/store/api/contacts'
import { Loader2 } from 'lucide-react'

interface CreateContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: ContactRole
  onContactCreated: (contactId: string) => void
  initialData?: {
    companyName: string
    email?: string
    phone?: string
    street?: string
    houseNumber?: string
    postalCode?: string
    city?: string
  }
}

export function CreateContactModal({
  open,
  onOpenChange,
  role,
  onContactCreated,
  initialData,
}: CreateContactModalProps) {
  const [formData, setFormData] = useState<CreateContactDto>({
    role,
    companyName: initialData?.companyName || '',
    street: initialData?.street || '',
    houseNumber: initialData?.houseNumber || '',
    postalCode: initialData?.postalCode || '',
    city: initialData?.city || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  })

  // Update form data when initialData changes (e.g., when modal opens with new extracted data)
  React.useEffect(() => {
    if (open && initialData) {
      setFormData({
        role,
        companyName: initialData.companyName || '',
        street: initialData.street || '',
        houseNumber: initialData.houseNumber || '',
        postalCode: initialData.postalCode || '',
        city: initialData.city || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
      })
    }
  }, [open, initialData, role])

  const [createContact, { isLoading }] = useCreateContactMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyName.trim()) {
      return
    }

    try {
      // Clean up empty strings - convert to undefined for optional fields
      const contactData: CreateContactDto = {
        role: formData.role,
        companyName: formData.companyName.trim(),
        street: formData.street?.trim() || undefined,
        houseNumber: formData.houseNumber?.trim() || undefined,
        postalCode: formData.postalCode?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
      }

      const newContact = await createContact(contactData).unwrap()
      onContactCreated(newContact.id)
      onOpenChange(false)
      // Reset form
      setFormData({
        role,
        companyName: '',
        street: '',
        houseNumber: '',
        postalCode: '',
        city: '',
        email: '',
        phone: '',
      })
    } catch (error) {
      console.error('Failed to create contact:', error)
    }
  }

  const handleChange = (field: keyof CreateContactDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Create New {role === 'PROPERTY_MANAGER' ? 'Property Manager' : 'Accountant'}
          </DialogTitle>
          <DialogDescription>
            Add a new {role === 'PROPERTY_MANAGER' ? 'property manager' : 'accountant'} to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Company Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              required
              className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              placeholder="Enter company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                Street
              </label>
              <input
                type="text"
                value={formData.street || ''}
                onChange={(e) => handleChange('street', e.target.value)}
                className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                placeholder="Street"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                House Number
              </label>
              <input
                type="text"
                value={formData.houseNumber || ''}
                onChange={(e) => handleChange('houseNumber', e.target.value)}
                className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                placeholder="House number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                placeholder="Postal code"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                City
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                placeholder="City"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                placeholder="+49 123 456789"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.companyName.trim()}
              className="rounded-full bg-buena-green hover:bg-buena-green/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
