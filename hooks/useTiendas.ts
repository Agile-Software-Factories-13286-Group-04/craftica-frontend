'use client';

import useSWR from 'swr';
import { tiendasAPI } from '@/services/api';
import { PaginatedResponse, Tienda } from '@/types';

export const useTiendas = (params?: { page?: number; limit?: number; ciudad?: string; pais?: string }) => {
  const { data, error, mutate } = useSWR<PaginatedResponse<Tienda>>(
    ['tiendas', params],
    () => tiendasAPI.getAll(params),
    { revalidateOnFocus: false }
  );

  return {
    tiendas: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    page: data?.page || 1,
    loading: !error && !data,
    error,
    mutate,
  };
};

export const useTienda = (id: string) => {
  const { data, error, mutate } = useSWR(
    id ? ['tienda', id] : null,
    () => tiendasAPI.getById(id),
    { revalidateOnFocus: false }
  );

  return {
    tienda: data?.data || null,
    loading: !error && !data,
    error,
    mutate,
  };
};