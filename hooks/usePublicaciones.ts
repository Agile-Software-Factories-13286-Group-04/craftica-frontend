'use client';

import useSWR from 'swr';
import { publicacionesAPI } from '@/services/api';
import { PaginatedResponse, Publicacion } from '@/types';

export const usePublicaciones = (params?: { page?: number; limit?: number; tienda_id?: string }) => {
  const { data, error, mutate } = useSWR<PaginatedResponse<Publicacion>>(
    ['publicaciones', params],
    () => publicacionesAPI.getAll(params),
    { revalidateOnFocus: false }
  );

  return {
    publicaciones: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    page: data?.page || 1,
    loading: !error && !data,
    error,
    mutate,
  };
};

export const usePublicacion = (id: string) => {
  const { data, error, mutate } = useSWR(
    id ? ['publicacion', id] : null,
    () => publicacionesAPI.getById(id),
    { revalidateOnFocus: false }
  );

  return {
    publicacion: data?.data || null,
    loading: !error && !data,
    error,
    mutate,
  };
};