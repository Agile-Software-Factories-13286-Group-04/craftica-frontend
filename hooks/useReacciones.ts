'use client';

import useSWR from 'swr';
import { reaccionesAPI } from '@/services/api';
import { Reaccion } from '@/types';

export const useReacciones = (publicacionId: string) => {
  const { data, error, mutate } = useSWR(
    publicacionId ? ['reacciones', publicacionId] : null,
    () => reaccionesAPI.getByPublicacion(publicacionId),
    { revalidateOnFocus: false }
  );

  return {
    reacciones: data?.data || [],
    loading: !error && !data,
    error,
    mutate,
  };
};