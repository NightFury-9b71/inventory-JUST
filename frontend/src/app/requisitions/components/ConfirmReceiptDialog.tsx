"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ItemRequest } from "@/services/itemRequestService";

interface ConfirmReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ItemRequest | null;
  remarks: string;
  setRemarks: (remarks: string) => void;
  onConfirm: () => void;
  isConfirming: boolean;
}

export function ConfirmReceiptDialog({
  open,
  onOpenChange,
  request,
  remarks,
  setRemarks,
  onConfirm,
  isConfirming,
}: ConfirmReceiptDialogProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Confirm Receipt</DialogTitle>
          <DialogDescription>
            Confirm that you have received the fulfilled items for this requisition.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Request Details</Label>
            <div className="rounded-md bg-gray-50 p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Request ID:</span>
                <span className="font-medium">#{request.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">{request.item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">From Office:</span>
                <span className="font-medium">{request.parentOffice.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fulfilled Quantity:</span>
                <span className="font-medium">{request.fulfilledQuantity}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation-remarks">Confirmation Remarks (Optional)</Label>
            <Textarea
              id="confirmation-remarks"
              placeholder="Add any comments about the received items (e.g., condition, completeness)..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Note: By confirming, you acknowledge that your office has received the items.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? "Confirming..." : "Confirm Receipt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
