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
import { ItemRequest, ApprovalRequest } from "@/services/itemRequestService";

interface ApproveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ItemRequest | null;
  approvalData: ApprovalRequest;
  onApprovalDataChange: (data: ApprovalRequest) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ApproveRequestDialog({
  open,
  onOpenChange,
  request,
  approvalData,
  onApprovalDataChange,
  onSubmit,
  isSubmitting,
}: ApproveRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Requisition</DialogTitle>
          <DialogDescription>
            Approve the request from {request?.requestingOffice.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Item</Label>
            <Input value={request?.item.name || ''} disabled />
          </div>

          <div>
            <Label>Requested Quantity</Label>
            <Input value={request?.requestedQuantity || ''} disabled />
          </div>

          <div>
            <Label htmlFor="approvedQty">Approved Quantity *</Label>
            <Input
              id="approvedQty"
              type="number"
              min="0"
              max={request?.requestedQuantity}
              step="0.01"
              value={approvalData.approvedQuantity || ''}
              onChange={(e) => 
                onApprovalDataChange({ 
                  ...approvalData, 
                  approvedQuantity: parseFloat(e.target.value) || 0 
                })
              }
              placeholder="Enter approved quantity"
            />
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
                Approving...
              </>
            ) : (
              'Approve'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
