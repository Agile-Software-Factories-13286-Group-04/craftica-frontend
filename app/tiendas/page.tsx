'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { useTiendas } from '@/hooks/useTiendas';
import { tiendasAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ErrorDisplay } from '@/components/ui/error-display';
import { MapPin, Phone, Clock, Plus, Eye, Store, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TiendasPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <TiendasContent />
      </Layout>
    </ProtectedRoute>
  );
}

const TiendasContent = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ ciudad: '', pais: '' });
  const [deletingTienda, setDeletingTienda] = useState<string | null>(null);

  const { tiendas, loading, error, totalPages, mutate } = useTiendas({
    page: currentPage,
    limit: 12,
    ...filters,
  });

  const handleDelete = async (tiendaId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tienda? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setDeletingTienda(tiendaId);
      await tiendasAPI.delete(tiendaId);
      toast.success('Tienda eliminada exitosamente');
      mutate(); // Refrescar la lista
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la tienda';
      toast.error(errorMessage);
    } finally {
      setDeletingTienda(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const newFilters = { ciudad: '', pais: '' };
    
    // Simple search logic - could be enhanced
    if (searchTerms.length > 0) {
      newFilters.ciudad = searchTerms[0];
      if (searchTerms.length > 1) {
        newFilters.pais = searchTerms.slice(1).join(' ');
      }
    }
    
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (loading && tiendas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tiendas...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Tiendas</h1>
          <p className="mt-2 text-gray-600">
            Descubre tiendas y artesanos locales
          </p>
        </div>
        <Link href="/tiendas/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear Tienda
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por ciudad o país..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Buscar
          </Button>
        </form>
      </div>

      {/* Tiendas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiendas.map((tienda) => (
          <Card key={tienda._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{tienda.nombre}</CardTitle>
                  <CardDescription className="mt-1">
                    Calificación: {tienda.calificacion}/5
                  </CardDescription>
                </div>
                {tienda.imagen && (
                  <div className="ml-4 flex-shrink-0">
                    <Image
                      src={tienda.imagen}
                      alt={`Imagen de ${tienda.nombre}`}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{tienda.localidad?.direccion || 'Dirección no disponible'}</span>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary">{tienda.localidad?.ciudad || 'Ciudad no disponible'}</Badge>
                <Badge variant="outline">{tienda.localidad?.pais || 'País no disponible'}</Badge>
              </div>
              
              <div className="pt-4 space-y-2">
                <Link href={`/tiendas/${tienda._id}`}>
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalles
                  </Button>
                </Link>
                
                {/* Botones de acción - temporalmente visibles para todas las tiendas */}
                <div className="flex gap-2">
                  <Link href={`/tiendas/${tienda._id}/edit`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDelete(tienda._id.toString())}
                    disabled={deletingTienda === tienda._id.toString()}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    {deletingTienda === tienda._id.toString() ? '...' : 'Eliminar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {tiendas.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Store className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron tiendas
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Sé el primero en crear una tienda'}
          </p>
          <Link href="/tiendas/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Tienda
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