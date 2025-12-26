import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Item } from "@/services/itemService";
import { Office } from "@/services/officeService";
import { ItemRequestLine } from "../hooks/useRequisitionForm";

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Item[];
  offices: Office[];
  currentUserOfficeId?: number;
  onSubmit: () => void;
  isSubmitting: boolean;
  requestItems: ItemRequestLine[];
  parentOfficeId: number;
  reason: string;
  onParentOfficeChange: (id: number) => void;
  onReasonChange: (reason: string) => void;
  onAddItem: (itemId: number, itemName: string, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

export function CreateRequestDialog({
  open,
  onOpenChange,
  items,
  offices,
  currentUserOfficeId,
  onSubmit,
  isSubmitting,
  requestItems,
  parentOfficeId,
  reason,
  onParentOfficeChange,
  onReasonChange,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
}: CreateRequestDialogProps) {
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const availableOffices = offices.filter(
    office => office.id !== currentUserOfficeId
  );

  const selectedItem = items.find(item => item.id === selectedItemId);

  const handleAddItem = () => {
    if (selectedItemId && quantity > 0) {
      const item = items.find(i => i.id === selectedItemId);
      if (item) {
        onAddItem(selectedItemId, item.name, quantity);
        setSelectedItemId(0);
        setQuantity(0);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Requisition</DialogTitle>
          <DialogDescription>
            Request multiple items from another office
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="office">Request From Office *</Label>
            <Select
              value={parentOfficeId.toString()}
              onValueChange={(value) => onParentOfficeChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select office" />
              </SelectTrigger>
              <SelectContent>
                {availableOffices.map((office) => (
                  <SelectItem key={office.id} value={office.id.toString()}>
                    {office.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <Label>Add Items</Label>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <Select
                  value={selectedItemId.toString()}
                  onValueChange={(value) => setSelectedItemId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  placeholder="Quantity"
                />
              </div>
              <div className="col-span-2">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedItemId || quantity <= 0}
                  className="w-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {requestItems.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => 
                            onUpdateQuantity(index, parseFloat(e.target.value) || 0)
                          }
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting || requestItems.length === 0 || !parentOfficeId}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              `Create ${requestItems.length} Request${requestItems.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
