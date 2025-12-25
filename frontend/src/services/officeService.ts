import serviceFactory from "@/services/serviceFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";


export interface Office {
  id: number;
  name: string;
  nameBn?: string;
  type: string;
  code?: string;
  description?: string;
  order?: number;
  isActive: boolean;
  parent?: Office;
  subOffices?: Office[];
}
export interface OfficeForm {
  name: string;
  nameBn?: string;
  type: string;
  code?: string;
  description?: string;
  order?: number;
  isActive: boolean;
  parentId?: number;
}

const officeService = serviceFactory<Office, OfficeForm>("/offices");

export const getOffices = officeService.getAll;
export const getOfficeById = officeService.getById;
export const createOffice = officeService.create;
export const updateOffice = officeService.update;
export const deleteOffice = officeService.delete;

// Get child offices by parent ID
export const getChildOffices = async (parentId: number): Promise<Office[]> => {
  const response = await api.get(`/offices/children/${parentId}`);
  return response.data;
};

// React Query Hooks
export const useOffices = () => {
  return useQuery({
    queryKey: ['offices'],
    queryFn: getOffices,
  });
};

export const useChildOffices = (parentId: number) => {
  return useQuery({
    queryKey: ['offices', 'children', parentId],
    queryFn: () => getChildOffices(parentId),
    enabled: !!parentId,
  });
};

export const useOffice = (id: number) => {
  return useQuery({
    queryKey: ['offices', id],
    queryFn: () => getOfficeById(id),
    enabled: !!id,
  });
};

export const useCreateOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOffice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] });
    },
  });
};

export const useUpdateOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OfficeForm> }) =>
      updateOffice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] });
    },
  });
};

export const useDeleteOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOffice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] });
    },
  });
};