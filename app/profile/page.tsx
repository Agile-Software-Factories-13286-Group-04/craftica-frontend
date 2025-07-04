'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <ProfileContent />
      </Layout>
    </ProtectedRoute>
  );
}

const ProfileContent = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        <Link href="/profile/edit">
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Información Personal
          </CardTitle>
          <CardDescription>
            Tu información personal y detalles de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Image */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4">
                  {user.foto ? (
                    <Image
                      src={user.foto}
                      alt={`${user.nombres} ${user.apellidos}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                  {user.nombres} {user.apellidos}
                </h2>
                <Badge variant="secondary" className="mt-2">
                  Usuario activo
                </Badge>
              </div>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <p className="text-gray-900">{user.nombres}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos
                  </label>
                  <p className="text-gray-900">{user.apellidos}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-3 h-5 w-5" />
                  <span>{user.credencial.correo}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-3 h-5 w-5" />
                  <span>{user.telefono}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-3 h-5 w-5" />
                  <span>{user.localidad.direccion}, {user.localidad.ciudad}, {user.localidad.pais}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-3 h-5 w-5" />
                  <span>Miembro desde {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Cuenta</CardTitle>
            <CardDescription>
              Administra tu cuenta y configuración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/profile/edit">
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Editar Información
              </Button>
            </Link>
            <Button variant="outline" className="w-full" disabled>
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad</CardTitle>
            <CardDescription>
              Resumen de tu actividad en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Fecha de registro</span>
              <span className="text-sm font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Última actualización</span>
              <span className="text-sm font-medium">
                {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estado</span>
              <Badge variant="secondary">Activo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};