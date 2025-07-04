'use client';

import useSWR from 'swr';
import { productosAPI } from '@/services/api';
import { PaginatedResponse, Producto } from '@/types';

export const useProductos = (params?: { page?: number; limit?: number; categoria?: string; tienda_id?: string }) => {
  const { data, error, mutate } = useSWR<PaginatedResponse<Producto>>(
    ['productos', params],
    () => productosAPI.getAll(params),
    { revalidateOnFocus: false }
  );

  return {
    productos: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    page: data?.page || 1,
    loading: !error && !data,
    error,
    mutate,
  };
};

export const useProducto = (id: string) => {
  const { data, error, mutate } = useSWR(
    id ? ['producto', id] : null,
    () => productosAPI.getById(id),
    { revalidateOnFocus: false }
  );

  return {
    producto: data?.data || null,
    loading: !error && !data,
    error,
    mutate,
  };
};