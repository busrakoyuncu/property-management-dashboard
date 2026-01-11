'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeletePropertyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId: string
  propertyName?: string
  onConfirm: () => void
}

export function DeletePropertyModal({
  open,
  onOpenChange,
  propertyId,
  propertyName,
  onConfirm,
}: DeletePropertyModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
          <DialogDescription className="pt-2">
            Do you really want to delete the property and all its data with id <span className="font-semibold underline">{propertyId}</span>
            {propertyName && (
              <span className="font-semibold underline">
                ({propertyName})?
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            No, Keep it
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="rounded-full bg-destructive hover:bg-destructive/90"
          >
            Yes, Delete it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
