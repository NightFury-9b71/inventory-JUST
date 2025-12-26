import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function PermissionAlert() {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Admin Permission Required</AlertTitle>
      <AlertDescription>
        Only users with Admin role can create, approve, or reject requisitions. 
        Please contact your system administrator if you need access.
      </AlertDescription>
    </Alert>
  );
}
