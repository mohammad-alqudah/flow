import { remove, edit, patch, post } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCustomPost = (endpoint: string, queryKey?: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => post(endpoint, body),
    onSuccess: () => {
      queryKey && queryClient.resetQueries({ queryKey });
    },
  });
};

export const useCustomUpdate = (endpoint: string, queryKey: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => edit(endpoint, body),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey });
    },
  });
};

export const useCustomPatch = (endpoint: string, queryKey: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => patch(endpoint, body),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey });
    },
  });
};

export const useCustomRemove = (endpoint: string, queryKey: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => remove(endpoint),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey });
    },
  });
};
