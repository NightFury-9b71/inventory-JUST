export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    FULFILLED: "bg-green-100 text-green-800",
    CONFIRMED: "bg-emerald-100 text-emerald-800",
    PARTIALLY_FULFILLED: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
};

export const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};
