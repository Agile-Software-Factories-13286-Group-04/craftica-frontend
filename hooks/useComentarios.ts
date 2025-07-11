'use client';

import useSWR from 'swr';
import { comentariosAPI } from '@/services/api';
import { Comentario } from '@/types';

export const useComentarios = (publicacionId: string | undefined) => {
  const { data, error, mutate } = useSWR(
    publicacionId && publicacionId !== 'undefined' ? ['comentarios', publicacionId] : null,
    () => comentariosAPI.getByPublicacion(publicacionId!),
    { revalidateOnFocus: false }
  );

  return {
    comentarios: data?.data || [],
    loading: !error && !data,
    error,
    mutate,
  };
};