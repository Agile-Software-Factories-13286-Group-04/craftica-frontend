'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { useProductos } from '@/hooks/useProductos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Package, Plus, Eye, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const categorias = [
  'Artesanías',
  'Textiles',
  'Cerámica',
  'Madera',
  'Joyería',
  'Decoración',
  'Ropa',
  'Accesorios',
  'Otros'
];

export default function ProductosPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <ProductosContent />
      </Layout>
    </ProtectedRoute>
  );
}

const ProductosContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { productos, loading, error, totalPages, mutate } = useProductos({
    page: currentPage,
    limit: 12,
    categoria: selectedCategory === 'todas' ? undefined : selectedCategory || undefined,
  });

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && productos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando productos...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="mt-2 text-gray-600">
            Explora nuestro catálogo de productos artesanales
          </p>
        </div>
        <Link href="/productos/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las categorías</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProductos.map((producto) => (
          <Card key={producto._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{producto.nombre}</CardTitle>
              <CardDescription className="line-clamp-2">
                {producto.descripcion}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{producto.categoria.join(', ')}</Badge>
                <span className="text-2xl font-bold text-primary">
                  ${producto.precio.toLocaleString()}
                </span>
              </div>
              
              <Link href={`/productos/${producto._id}`}>
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
      {filteredProductos.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory 
              ? 'Intenta con otros términos de búsqueda o filtros' 
              : 'Sé el primero en agregar un producto'}
          </p>
          <Link href="/productos/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
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