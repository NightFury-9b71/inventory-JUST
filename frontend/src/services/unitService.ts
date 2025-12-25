import serviceFactory from "@/services/serviceFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Unit {
  id: number;
  name: string;
  description?: string;
}

export interface UnitForm {
  name: string;
  description?: string;
}

const unitService = serviceFactory<Unit, UnitForm>("/units");

export const getUnits = unitService.getAll;
export const getUnitById = unitService.getById;
export const createUnit = unitService.create;
export const updateUnit = unitService.update;
export const deleteUnit = unitService.delete;

// React Query Hooks
export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: getUnits,
  });
};

export const useUnit = (id: number) => {
  return useQuery({
    queryKey: ['units', id],
    queryFn: () => getUnitById(id),
    enabled: !!id,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UnitForm> }) =>
      updateUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};
