import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ItemRequest, FulfillmentRequest } from "@/services/itemRequestService";

interface FulfillRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ItemRequest | null;
  fulfillmentData: FulfillmentRequest;
  onFulfillmentDataChange: (data: FulfillmentRequest) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function FulfillRequestDialog({
  open,
  onOpenChange,
  request,
  fulfillmentData,
  onFulfillmentDataChange,
  onSubmit,
  isSubmitting,
}: FulfillRequestDialogProps) {
  const remainingQuantity = request 
    ? (request.approvedQuantity || 0) - (request.fulfilledQuantity || 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fulfill Requisition</DialogTitle>
          <DialogDescription>
            Fulfill the approved request for {request?.requestingOffice.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Item</Label>
            <Input value={request?.item.name || ''} disabled />
          </div>

          <div>
            <Label>Approved Quantity</Label>
            <Input value={request?.approvedQuantity || ''} disabled />
          </div>

          <div>
            <Label>Already Fulfilled</Label>
            <Input value={request?.fulfilledQuantity || 0} disabled />
          </div>

          <div>
            <Label>Remaining to Fulfill</Label>
            <Input value={remainingQuantity} disabled />
          </div>

          <div>
            <Label htmlFor="fulfillQty">Quantity to Fulfill *</Label>
            <Input
              id="fulfillQty"
              type="number"
              min="1"
              max={remainingQuantity}
              step="1"
              value={fulfillmentData.quantity || ''}
              onChange={(e) => 
                onFulfillmentDataChange({ 
                  ...fulfillmentData, 
                  quantity: parseInt(e.target.value) || 0 
                })
              }
              placeholder="Enter quantity to fulfill"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {remainingQuantity}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fulfilling...
              </>
            ) : (
              'Fulfill'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
