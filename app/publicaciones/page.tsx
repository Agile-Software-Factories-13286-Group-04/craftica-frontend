'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { usePublicaciones } from '@/hooks/usePublicaciones';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ErrorDisplay } from '@/components/ui/error-display';
import { MessageSquare, Plus, Eye, Calendar, Images } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PublicacionesPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <PublicacionesContent />
      </Layout>
    </ProtectedRoute>
  );
}

const PublicacionesContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { publicaciones, loading, error, totalPages, mutate } = usePublicaciones({
    page: currentPage,
    limit: 12,
  });

  if (loading && publicaciones.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => mutate()} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Publicaciones</h1>
          <p className="mt-2 text-gray-600">
            Descubre las últimas novedades y promociones
          </p>
        </div>
        <Link href="/publicaciones/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear Publicación
          </Button>
        </Link>
      </div>

      {/* Publicaciones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicaciones.map((publicacion) => (
          <Card key={publicacion._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(publicacion.fecha).toLocaleDateString()}
                </Badge>
                {publicacion.imagenes && publicacion.imagenes.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Images className="mr-1 h-3 w-3" />
                    {publicacion.imagenes.length}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{publicacion.titulo}</CardTitle>
              <CardDescription className="line-clamp-2">
                {publicacion.descripcion}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Gallery Preview */}
              {publicacion.imagenes && publicacion.imagenes.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {publicacion.imagenes.slice(0, 4).map((imagen, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={imagen}
                        alt={`${publicacion.titulo} - imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 3 && publicacion.imagenes && publicacion.imagenes.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium">
                            +{publicacion.imagenes.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <Link href={`/publicaciones/${publicacion._id}`}>
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {publicaciones.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay publicaciones
          </h3>
          <p className="text-gray-600 mb-4">
            Sé el primero en crear una publicación
          </p>
          <Link href="/publicaciones/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Publicación
            </Button>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};