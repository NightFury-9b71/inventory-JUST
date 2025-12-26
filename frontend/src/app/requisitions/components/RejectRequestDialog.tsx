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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ItemRequest, RejectionRequest } from "@/services/itemRequestService";

interface RejectRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ItemRequest | null;
  rejectionData: RejectionRequest;
  onRejectionDataChange: (data: RejectionRequest) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function RejectRequestDialog({
  open,
  onOpenChange,
  request,
  rejectionData,
  onRejectionDataChange,
  onSubmit,
  isSubmitting,
}: RejectRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Requisition</DialogTitle>
          <DialogDescription>
            Reject the request from {request?.requestingOffice.name}
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
            <Label htmlFor="rejectionReason">Rejection Reason *</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionData.remarks}
              onChange={(e) => 
                onRejectionDataChange({ remarks: e.target.value })
              }
              placeholder="Provide reason for rejection"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              'Reject'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
