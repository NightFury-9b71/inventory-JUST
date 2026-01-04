"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout, Header } from "@/components/page";
import { usePurchase } from "@/services/purchaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, FileText, Calendar, User, Building, DollarSign, Download, Receipt as ReceiptIcon, ExternalLink, Hash, QrCode } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getOptimizedImageUrl, downloadFile } from "@/lib/cloudinary";
import { BarcodePrintDialog } from "@/components/BarcodePrintDialog";

export default function PurchaseDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const purchaseId = parseInt(params.id as string);
  
  const { data: purchase, isLoading, error } = usePurchase(purchaseId);
  const [showBarcodeDialog, setShowBarcodeDialog] = useState(false);
  const [barcodeItems, setBarcodeItems] = useState<{ itemInstanceId: number; barcode: string; itemName: string; }[]>([]);

  if (!user) {
    return (
      <PageLayout
        header={<Header title="Purchase Details" subtitle="" />}
        body={
          <div className="flex items-center justify-center min-h-[50vh] px-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Authentication Required</CardTitle>
                <CardDescription className="text-sm sm:text-base">Please log in to view purchase details</CardDescription>
              </CardHeader>
            </Card>
          </div>
        }
      />
    );
  }

  const downloadPurchasePDF = () => {
    if (!purchase) return;
    
    try {
      const itemsSection = purchase.items.map((item, index) => 
        `${index + 1}. ${item.item.name} - Qty: ${item.quantity}, Unit Price: ৳${item.unitPrice.toFixed(2)}, Total: ৳${item.totalPrice.toFixed(2)}`
      ).join('\n');

      const doc = `
PURCHASE RECEIPT
${'='.repeat(50)}

Purchase ID: ${purchase.id}
Date: ${new Date(purchase.purchasedDate).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

PURCHASE DETAILS
${'-'.repeat(50)}
Supplier: ${purchase.supplier}
${purchase.invoiceNumber ? `Invoice Number: ${purchase.invoiceNumber}` : ''}
${purchase.remarks ? `Remarks: ${purchase.remarks}` : ''}

ITEMS
${'-'.repeat(50)}
${itemsSection}

TOTAL SUMMARY
${'-'.repeat(50)}
Total Items: ${purchase.totalItems}
Total Amount: ৳${purchase.totalAmount.toFixed(2)}

OFFICE INFORMATION
${'-'.repeat(50)}
Office: ${purchase.office.name}
Purchased By: ${purchase.purchasedBy.name || purchase.purchasedBy.username}

${'='.repeat(50)}
Generated on: ${new Date().toLocaleString()}
      `;

      const blob = new Blob([doc], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `purchase-${purchase.id}-${new Date().getTime()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Purchase receipt downloaded');
    } catch (error) {
      console.error('Failed to download purchase receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const handleDownloadReceipt = async () => {
    if (!purchase?.receiptUrl) return;
    
    try {
      const isPdf = purchase.receiptUrl.toLowerCase().endsWith('.pdf');
      const extension = isPdf ? 'pdf' : 'jpg';
      const filename = `receipt-purchase-${purchase.id}.${extension}`;
      
      await downloadFile(purchase.receiptUrl, filename);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Failed to download receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  if (isLoading) {
    return (
      <PageLayout
        header={<Header title="Purchase Details" subtitle="Loading..." />}
        body={
          <div className="mx-auto my-4 sm:my-6 md:my-8 max-w-4xl space-y-4 sm:space-y-6 px-4 sm:px-0">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
                <Skeleton className="h-3 sm:h-4 w-64 sm:w-96" />
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Skeleton className="h-16 sm:h-20 w-full" />
                <Skeleton className="h-16 sm:h-20 w-full" />
                <Skeleton className="h-16 sm:h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        }
      />
    );
  }

  if (error || !purchase) {
    return (
      <PageLayout
        header={<Header title="Purchase Details" subtitle="Error loading purchase" />}
        body={
          <div className="mx-auto my-4 sm:my-6 md:my-8 max-w-4xl px-4 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive text-lg sm:text-xl">Error</CardTitle>
                <CardDescription className="text-sm sm:text-base">Failed to load purchase details</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/purchases")} className="w-full sm:w-auto text-sm sm:text-base">
                  <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Back to Purchases
                </Button>
              </CardContent>
            </Card>
          </div>
        }
      />
    );
  }

  return (
    <>
      <PageLayout
        header={
        <Header 
          title={`Purchase #${purchase.id}`}
          subtitle="Complete purchase details with all items"
          actions={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={downloadPurchasePDF} className="w-full sm:w-auto text-sm sm:text-base">
                <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={() => router.push("/purchases")} className="w-full sm:w-auto text-sm sm:text-base">
                <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Back
              </Button>
            </div>
          }
        />
      }
      body={
        <div className="mx-auto my-4 sm:my-6 md:my-8 max-w-5xl space-y-4 sm:space-y-6 px-4 sm:px-0">
          {/* Purchase Header Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Purchase Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Supplier</p>
                  <p className="font-medium text-sm sm:text-base">{purchase.supplier}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
                    Invoice Number
                  </p>
                  <p className="font-medium text-sm sm:text-base">{purchase.invoiceNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    Purchase Date
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {new Date(purchase.purchasedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                    Office
                  </p>
                  <p className="font-medium text-sm sm:text-base">{purchase.office.name}</p>
                </div>
              </div>
              
              {purchase.remarks && (
                <div className="pt-2 border-t">
                  <p className="text-xs sm:text-sm text-gray-500">Remarks</p>
                  <p className="font-medium text-sm sm:text-base mt-1">{purchase.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                    Purchased Items
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {purchase.totalItems} item{purchase.totalItems !== 1 ? 's' : ''} in this purchase
                  </CardDescription>
                </div>
                {purchase.items.some(item => item.itemInstanceIds && item.itemInstanceIds.length > 0) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto text-xs sm:text-sm"
                    onClick={() => {
                      const allInstances: { itemInstanceId: number; barcode: string; itemName: string; }[] = [];
                      purchase.items.forEach((item: any) => {
                        if (item.itemInstanceIds && item.itemBarcodes) {
                          item.itemInstanceIds.forEach((id: number, index: number) => {
                            allInstances.push({
                              itemInstanceId: id,
                              barcode: item.itemBarcodes[index],
                              itemName: item.item.name
                            });
                          });
                        }
                      });
                      setBarcodeItems(allInstances);
                      setShowBarcodeDialog(true);
                    }}
                  >
                    <QrCode className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Print All Barcodes
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8 sm:w-12 text-xs sm:text-sm">#</TableHead>
                      <TableHead className="text-xs sm:text-sm whitespace-nowrap">Item Name</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Quantity</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap hidden sm:table-cell">Unit Price</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Total</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchase.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{index + 1}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.item.name}</TableCell>
                        <TableCell className="text-right text-xs sm:text-sm">{item.quantity}</TableCell>
                        <TableCell className="text-right text-xs sm:text-sm hidden sm:table-cell">৳{item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium text-xs sm:text-sm whitespace-nowrap">৳{item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-center hidden md:table-cell">
                          {item.itemInstanceIds && item.itemInstanceIds.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                const instances = item.itemInstanceIds!.map((id, idx) => ({
                                  itemInstanceId: id,
                                  barcode: item.itemBarcodes![idx],
                                  itemName: item.item.name
                                }));
                                setBarcodeItems(instances);
                                setShowBarcodeDialog(true);
                              }}
                            >
                              <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-blue-50 dark:bg-blue-950 font-semibold">
                      <TableCell colSpan={3} className="text-right text-xs sm:text-sm sm:hidden">Grand Total</TableCell>
                      <TableCell colSpan={4} className="text-right text-xs sm:text-sm hidden sm:table-cell md:hidden">Grand Total</TableCell>
                      <TableCell colSpan={5} className="text-right text-xs sm:text-sm hidden md:table-cell">Grand Total</TableCell>
                      <TableCell className="text-right text-base sm:text-lg text-blue-600 whitespace-nowrap font-bold">
                        ৳{purchase.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Display */}
          {purchase.receiptUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <ReceiptIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  Receipt / Invoice Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {purchase.receiptUrl.toLowerCase().endsWith('.pdf') ? (
                    <div className="space-y-3">
                      <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">PDF Receipt</p>
                            <p className="text-xs sm:text-sm text-gray-500">Click to view the receipt document</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={() => window.open(purchase.receiptUrl, '_blank')}
                          className="flex-1 text-sm sm:text-base"
                        >
                          <ExternalLink className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Open PDF
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleDownloadReceipt}
                          className="w-full sm:w-auto text-sm sm:text-base"
                        >
                          <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={getOptimizedImageUrl(purchase.receiptUrl, 800, undefined, 85)}
                          alt="Purchase receipt"
                          className="w-full h-auto"
                          onClick={() => window.open(purchase.receiptUrl, '_blank')}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => window.open(purchase.receiptUrl, '_blank')}
                          className="flex-1 text-sm sm:text-base"
                        >
                          <ExternalLink className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          View Full Size
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleDownloadReceipt}
                          className="w-full sm:w-auto text-sm sm:text-base"
                        >
                          <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Purchaser Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Purchaser Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Purchased By</p>
                <Link 
                  href={`/profile/${purchase.purchasedBy.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-base sm:text-lg"
                >
                  {purchase.purchasedBy.name || purchase.purchasedBy.username}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      }
      />

      <BarcodePrintDialog
        open={showBarcodeDialog}
        onOpenChange={setShowBarcodeDialog}
        items={barcodeItems}
        title="Print Barcode Labels"
      />
    </>
  );
}
