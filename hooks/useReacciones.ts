'use client';

import useSWR from 'swr';
import { reaccionesAPI } from '@/services/api';
import { Reaccion } from '@/types';

export const useReacciones = (publicacionId: string | undefined) => {
  const { data, error, mutate } = useSWR(
    publicacionId && publicacionId !== 'undefined' ? ['reacciones', publicacionId] : null,
    () => reaccionesAPI.getByPublicacion(publicacionId!),
    { revalidateOnFocus: false }
  );

  return {
    reacciones: data?.data || [],
    loading: !error && !data,
    error,
    mutate,
  };
};