'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { usePublicacion } from '@/hooks/usePublicaciones';
import { useComentarios } from '@/hooks/useComentarios';
import { useReacciones } from '@/hooks/useReacciones';
import { comentariosAPI, reaccionesAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ErrorDisplay } from '@/components/ui/error-display';
import { ArrowLeft, Edit, Calendar, MessageSquare, ThumbsUp, ThumbsDown, Send, Images } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

const comentarioSchema = z.object({
  contenido: z.string().min(1, 'El comentario no puede estar vacío'),
});

type ComentarioFormData = z.infer<typeof comentarioSchema>;

export default function PublicacionDetailPage() {
  const params = useParams();
  const publicacionId = params.id as string;

  return (
    <ProtectedRoute>
      <Layout>
        <PublicacionDetailContent publicacionId={publicacionId} />
      </Layout>
    </ProtectedRoute>
  );
}

const PublicacionDetailContent = ({ publicacionId }: { publicacionId: string }) => {
  const { user } = useAuth();
  const { publicacion, loading, error, mutate } = usePublicacion(publicacionId);
  const { comentarios, mutate: mutateComentarios } = useComentarios(publicacionId);
  const { reacciones, mutate: mutateReacciones } = useReacciones(publicacionId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [comentarioLoading, setComentarioLoading] = useState(false);
  const [reaccionLoading, setReaccionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ComentarioFormData>({
    resolver: zodResolver(comentarioSchema),
  });

  const handleComentario = async (data: ComentarioFormData) => {
    if (!user) return;

    try {
      setComentarioLoading(true);
      await comentariosAPI.create({
        contenido: data.contenido,
        usuario_id: user.id,
        publicacion_id: publicacionId,
      });
      
      toast.success('Comentario agregado');
      reset();
      mutateComentarios();
    } catch (err) {
      toast.error('Error al agregar comentario');
    } finally {
      setComentarioLoading(false);
    }
  };

  const handleReaccion = async (tipo: 'like' | 'dislike') => {
    if (!user) return;

    try {
      setReaccionLoading(true);
      
      // Buscar si ya existe una reacción del usuario
      const existingReaction = reacciones.find(r => r.usuario_id === user.id);
      
      if (existingReaction) {
        if (existingReaction.tipo === tipo) {
          // Eliminar reacción si es la misma
          await reaccionesAPI.delete(existingReaction.id);
        } else {
          // Actualizar reacción si es diferente
          await reaccionesAPI.update(existingReaction.id, { tipo });
        }
      } else {
        // Crear nueva reacción
        await reaccionesAPI.create({
          tipo,
          usuario_id: user.id,
          publicacion_id: publicacionId,
        });
      }
      
      mutateReacciones();
    } catch (err) {
      toast.error('Error al procesar reacción');
    } finally {
      setReaccionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando publicación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => mutate()} />;
  }

  if (!publicacion) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Publicación no encontrada
        </h2>
        <p className="text-gray-600 mb-4">
          La publicación que buscas no existe o ha sido eliminada.
        </p>
        <Link href="/publicaciones">
          <Button>Volver a Publicaciones</Button>
        </Link>
      </div>
    );
  }

  const likesCount = reacciones.filter(r => r.tipo === 'like').length;
  const dislikesCount = reacciones.filter(r => r.tipo === 'dislike').length;
  const userReaction = reacciones.find(r => r.usuario_id === user?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/publicaciones">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{publicacion.titulo}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{new Date(publicacion.fecha_publicacion).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <Link href={`/publicaciones/${publicacion.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Main Content */}
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-lg leading-relaxed">{publicacion.contenido}</p>
            </div>
          </CardContent>
        </Card>

        {/* Image Gallery */}
        {publicacion.imagenes && publicacion.imagenes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Images className="mr-2 h-5 w-5" />
                Galería de Imágenes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Main Image */}
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                <Image
                  src={publicacion.imagenes[selectedImageIndex]}
                  alt={`${publicacion.titulo} - imagen ${selectedImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Thumbnails */}
              {publicacion.imagenes.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {publicacion.imagenes.map((imagen, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex
                          ? 'border-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={imagen}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reactions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Button
                variant={userReaction?.tipo === 'like' ? 'default' : 'outline'}
                onClick={() => handleReaccion('like')}
                disabled={reaccionLoading}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{likesCount}</span>
              </Button>
              <Button
                variant={userReaction?.tipo === 'dislike' ? 'default' : 'outline'}
                onClick={() => handleReaccion('dislike')}
                disabled={reaccionLoading}
                className="flex items-center gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{dislikesCount}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Comentarios ({comentarios.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Comment Form */}
            <form onSubmit={handleSubmit(handleComentario)} className="space-y-4">
              <Textarea
                placeholder="Escribe un comentario..."
                {...register('contenido')}
                rows={3}
              />
              {errors.contenido && (
                <p className="text-sm text-red-600">{errors.contenido.message}</p>
              )}
              <Button type="submit" disabled={comentarioLoading}>
                {comentarioLoading ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Comentar
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comentarios.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </p>
              ) : (
                comentarios.map((comentario) => (
                  <div key={comentario.id} className="border-l-4 border-gray-200 pl-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        Usuario {comentario.usuario_id}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comentario.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comentario.contenido}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};