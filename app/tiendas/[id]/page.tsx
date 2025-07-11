'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useTienda } from '@/hooks/useTiendas';
import { usePublicaciones } from '@/hooks/usePublicaciones';
import { tiendasAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ErrorDisplay } from '@/components/ui/error-display';
import { MapPin, Phone, Clock, Edit, MessageSquare, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TiendaDetailPage() {
  const params = useParams();
  const tiendaId = params.id as string;

  return (
    <ProtectedRoute>
      <Layout>
        <TiendaDetailContent tiendaId={tiendaId} />
      </Layout>
    </ProtectedRoute>
  );
}

const TiendaDetailContent = ({ tiendaId }: { tiendaId: string }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { tienda, loading, error, mutate } = useTienda(tiendaId);
  const { publicaciones, loading: publicacionesLoading } = usePublicaciones({
    tienda_id: tiendaId,
    limit: 6,
  });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tienda? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setDeleting(true);
      await tiendasAPI.delete(tiendaId);
      toast.success('Tienda eliminada exitosamente');
      router.push('/tiendas');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la tienda';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => mutate()} />;
  }

  if (!tienda) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tienda no encontrada
        </h2>
        <p className="text-gray-600 mb-4">
          La tienda que buscas no existe o ha sido eliminada.
        </p>
        <Link href="/tiendas">
          <Button>Volver a Tiendas</Button>
        </Link>
      </div>
    );
  }

  // TODO: Implementar verificación de propietario cuando el backend incluya usuario_id
  // Temporalmente habilitado para pruebas
  const isOwner = true; // user?._id === tienda.usuario_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tienda.nombre}</h1>
                <p className="text-gray-600 mt-1">
                  Tienda creada el {new Date(tienda.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-3 h-5 w-5" />
                <span>Información de ubicación no disponible</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Phone className="mr-3 h-5 w-5" />
                <span>Información de contacto no disponible</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="mr-3 h-5 w-5" />
                <span>Horarios no disponibles</span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex flex-col gap-2">
              <Link href={`/tiendas/${tienda._id}/edit`}>
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Tienda
                </Button>
              </Link>
              <Link href="/productos/create">
                <Button variant="outline" className="w-full">
                  Agregar Producto
                </Button>
              </Link>
              <Link href="/publicaciones/create">
                <Button variant="outline" className="w-full">
                  Crear Publicación
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleting ? 'Eliminando...' : 'Eliminar Tienda'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Publicaciones */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Publicaciones</h2>
          <Link href="/publicaciones">
            <Button variant="outline">Ver Todas</Button>
          </Link>
        </div>

        {publicacionesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : publicaciones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicaciones.map((publicacion) => (
              <Card key={publicacion._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{publicacion.titulo}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(publicacion.fecha).toLocaleDateString()}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {publicacion.descripcion}
                  </p>
                  {publicacion.imagenes && publicacion.imagenes.length > 0 && (
                    <div className="mb-4">
                      <Image
                        src={publicacion.imagenes[0]}
                        alt={publicacion.titulo}
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    </div>
                  )}
                  <Link href={`/publicaciones/${publicacion._id}`}>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay publicaciones
            </h3>
            <p className="text-gray-600">
              {isOwner ? 'Crea tu primera publicación para compartir novedades' : 'Esta tienda aún no tiene publicaciones'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};