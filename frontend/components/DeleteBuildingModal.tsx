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

interface DeleteBuildingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  buildingId: string
  buildingName: string
  onConfirm: () => void
}

export function DeleteBuildingModal({
  open,
  onOpenChange,
  buildingId,
  buildingName,
  onConfirm,
}: DeleteBuildingModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Building</DialogTitle>
          <DialogDescription className="pt-2">
            Do you really want to delete this building from this property{' '}
            {buildingName && (
              <span className="font-semibold underline">{buildingName}</span>
            )}
            ?
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
