import api from "@/lib/api";
import { ItemInstance } from "./inventoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface BarcodeSearchResult {
  itemInstance: ItemInstance;
  transactionHistory: Array<{
    id: number;
    transactionDate: string;
    transactionType: string;
    fromOffice?: {
      id: number;
      name: string;
    };
    toOffice?: {
      id: number;
      name: string;
    };
    remarks?: string;
  }>;
}

// Track item by barcode
export const trackByBarcode = async (barcode: string): Promise<BarcodeSearchResult> => {
  const response = await api.get(`/tracking/barcode/${barcode}`);
  return response.data;
};

// Bulk barcode search
export const bulkBarcodeSearch = async (barcodes: string[]): Promise<BarcodeSearchResult[]> => {
  const response = await api.post("/tracking/barcodes", { barcodes });
  return response.data;
};

// React Query Hooks
export const useTrackByBarcode = (barcode: string) => {
  return useQuery({
    queryKey: ['tracking', 'barcode', barcode],
    queryFn: () => trackByBarcode(barcode),
    enabled: !!barcode,
  });
};

export const useBulkBarcodeSearch = () => {
  return useMutation({
    mutationFn: bulkBarcodeSearch,
  });
};
