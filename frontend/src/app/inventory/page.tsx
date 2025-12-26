"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  PageLayout,
  Header
} from "@/components/page";

import { FilterGroup as Filter } from "@/components/filters";
import { SearchGroup as Search } from "@/components/search";
import { PaginationGroup as Pagination } from "@/components/pagination";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Package } from "lucide-react";
import { useTableActions } from "@/hooks/useTableActions";
import { useMyOfficeInventory, ItemInstance } from "@/services/inventoryService";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const searchConfig = {
  placeholder: "Search inventory items...",
  searchKeys: ["barcode"],
};

const paginationConfig = {
  itemsPerPage: 10,
  showEllipsis: true,
  maxVisiblePages: 5,
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  AVAILABLE: "secondary",
  IN_USE: "default",
  UNDER_MAINTENANCE: "outline",
  DAMAGED: "destructive",
  DISPOSED: "destructive",
};

const conditionColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  NEW: "secondary",
  GOOD: "default",
  FAIR: "outline",
  POOR: "destructive",
};

const RowActions = ({ item, onView }: { item: ItemInstance, onView: (item: any) => void }) => (
  <div className="flex gap-2">
    <Eye
      className="w-5 h-5 cursor-pointer hover:text-blue-600"
      onClick={() => onView(item)}
    />
  </div>
);

// Helper function to search in nested object properties
const searchInInventory = (items: ItemInstance[], query: string): ItemInstance[] => {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(instance => 
    instance.barcode.toLowerCase().includes(lowerQuery) ||
    instance.item.name.toLowerCase().includes(lowerQuery) ||
    (instance.item.description?.toLowerCase().includes(lowerQuery) ?? false) ||
    instance.ownerOffice.name.toLowerCase().includes(lowerQuery) ||
    (instance.currentOffice?.name.toLowerCase().includes(lowerQuery) ?? false)
  );
};

function Body({ data }: { data: ItemInstance[] }){
  const { handleView } = useTableActions("/inventory");

  return(
    <>
    <div className="mx-auto my-8 max-w-7xl">
      <Table>
        <TableCaption>Inventory items belonging to your office.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Barcode</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Owner Office</TableHead>
            <TableHead>Current Office</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((instance) => (
          <TableRow key={instance.id}>
            <TableCell className="font-mono font-medium">{instance.barcode}</TableCell>
            <TableCell className="font-medium">{instance.item.name}</TableCell>
            <TableCell>
              {instance.item.category ? (
                <Badge variant="outline">{instance.item.category.name}</Badge>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{instance.ownerOffice.name}</span>
                {instance.ownerOffice.code && (
                  <span className="text-xs text-gray-500">{instance.ownerOffice.code}</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              {instance.currentOffice ? (
                <div className="flex flex-col">
                  <span className="font-medium">{instance.currentOffice.name}</span>
                  {instance.currentOffice.code && (
                    <span className="text-xs text-gray-500">{instance.currentOffice.code}</span>
                  )}
                </div>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={statusColors[instance.status] || "default"}>
                {instance.status.replace(/_/g, ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              {instance.condition ? (
                <Badge variant={conditionColors[instance.condition] || "default"}>
                  {instance.condition}
                </Badge>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              {instance.purchaseDate ? (
                new Date(instance.purchaseDate).toLocaleDateString()
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              <RowActions item={instance} onView={handleView} />
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </>
  )
}

export default function InventoryPage() {
  const { user } = useAuth();
  const { data: items = [], isLoading, error } = useMyOfficeInventory();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState<ItemInstance[]>([]);
  const [paginatedData, setPaginatedData] = useState<ItemInstance[]>([]);

  useEffect(() => {
    const filtered = searchInInventory(items, searchQuery);
    setSearchedData(filtered);
  }, [items, searchQuery]);

  if (!user) {
    return (
      <PageLayout
        header={<Header title="Inventory" subtitle="" />}
        body={
          <div className="flex items-center justify-center h-[50vh]">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>Please log in to view inventory</CardDescription>
              </CardHeader>
            </Card>
          </div>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <PageLayout
        header={<Header title="My Office Inventory" subtitle="" />}
        body={
          <div className="flex items-center justify-center h-[50vh]">
            <div className="flex flex-col items-center gap-2">
              <Package className="w-8 h-8 animate-pulse" />
              <p>Loading inventory...</p>
            </div>
          </div>
        }
      />
    );
  }

  if (error) {
    return (
      <PageLayout
        header={<Header title="My Office Inventory" subtitle="" />}
        body={
          <div className="flex items-center justify-center h-[50vh]">
            <Card className="w-96">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription>Failed to load inventory data</CardDescription>
              </CardHeader>
            </Card>
          </div>
        }
      />
    );
  }

  return (
    <PageLayout
      header={
        <Header 
          title="My Office Inventory" 
          subtitle="View all items belonging to your office"
          searchbar={
            <input
              type="text"
              placeholder="Search inventory items..."
              className="border rounded px-3 py-2 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          }
        />
      }
      body={
        <>
          <div className="mx-auto my-4 max-w-7xl">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
                <CardDescription>
                  Total items in your office: <span className="font-bold text-lg">{items.length}</span>
                  {searchQuery && (
                    <> | Filtered: <span className="font-bold text-lg">{searchedData.length}</span></>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {searchedData.length === 0 ? (
            <div className="flex items-center justify-center h-[30vh]">
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  {items.length === 0 
                    ? "No inventory items found in your office"
                    : "No items match your search"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <Body data={paginatedData} />
              <Pagination
                data={searchedData}
                config={paginationConfig}
                onPaginatedData={setPaginatedData}
              />
            </>
          )}
        </>
      }
    />
  );
}
