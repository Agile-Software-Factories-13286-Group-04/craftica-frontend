'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useTiendas } from '@/hooks/useTiendas';
import { useProductos } from '@/hooks/useProductos';
import { usePublicaciones } from '@/hooks/usePublicaciones';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Package, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardContent />
      </Layout>
    </ProtectedRoute>
  );
}

const DashboardContent = () => {
  const { user } = useAuth();
  const { tiendas, loading: tiendasLoading } = useTiendas({ limit: 1 });
  const { productos, loading: productosLoading } = useProductos({ limit: 1 });
  const { publicaciones, loading: publicacionesLoading } = usePublicaciones({ limit: 1 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Bienvenido, {user?.nombre}!
        </h1>
        <p className="mt-2 text-gray-600">
          Gestiona tus tiendas, productos y publicaciones desde tu dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiendas</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tiendasLoading ? '...' : tiendas.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Tiendas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productosLoading ? '...' : productos.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicaciones</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publicacionesLoading ? '...' : publicaciones.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Publicaciones recientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              Tiendas
            </CardTitle>
            <CardDescription>
              Gestiona tus tiendas y sus detalles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/tiendas">
              <Button variant="outline" className="w-full">
                Ver Tiendas
              </Button>
            </Link>
            <Link href="/tiendas/create">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Crear Tienda
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Productos
            </CardTitle>
            <CardDescription>
              Administra tu catálogo de productos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/productos">
              <Button variant="outline" className="w-full">
                Ver Productos
              </Button>
            </Link>
            <Link href="/productos/create">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Crear Producto
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Publicaciones
            </CardTitle>
            <CardDescription>
              Comparte novedades y promociones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/publicaciones">
              <Button variant="outline" className="w-full">
                Ver Publicaciones
              </Button>
            </Link>
            <Link href="/publicaciones/create">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Crear Publicación
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};