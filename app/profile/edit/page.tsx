'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, User, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const profileSchema = z.object({
  nombres: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
  correo: z.string().email('Correo electrónico inválido'),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  ciudad: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  pais: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
  foto: z.string().url('La foto debe ser una URL válida').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <EditProfileContent />
      </Layout>
    </ProtectedRoute>
  );
}

const EditProfileContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Cargar datos del usuario en el formulario
  useEffect(() => {
    if (user) {
      reset({
        nombres: user.nombres,
        apellidos: user.apellidos,
        telefono: user.telefono,
        correo: user.credencial.correo,
        direccion: user.localidad.direccion,
        ciudad: user.localidad.ciudad,
        pais: user.localidad.pais,
        foto: user.foto || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const updatedData = {
        ...data,
        foto: data.foto || undefined,
      };

      await authAPI.updateProfile(user._id.toString(), updatedData);
      
      // Actualizar el usuario en localStorage
      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem('craftica_user', JSON.stringify(updatedUser));
      
      toast.success('Perfil actualizado exitosamente');
      router.push('/profile');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
            <p className="mt-2 text-gray-600">
              Actualiza tu información personal
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Información Personal
          </CardTitle>
          <CardDescription>
            Modifica tus datos personales y de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombre *</Label>
                <Input
                  id="nombres"
                  placeholder="Juan"
                  {...register('nombres')}
                />
                {errors.nombres && (
                  <p className="text-sm text-red-600">{errors.nombres.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  placeholder="Pérez"
                  {...register('apellidos')}
                />
                {errors.apellidos && (
                  <p className="text-sm text-red-600">{errors.apellidos.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico *</Label>
              <Input
                id="correo"
                type="email"
                placeholder="tu@email.com"
                {...register('correo')}
              />
              {errors.correo && (
                <p className="text-sm text-red-600">{errors.correo.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  placeholder="1234567890"
                  {...register('telefono')}
                />
                {errors.telefono && (
                  <p className="text-sm text-red-600">{errors.telefono.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  placeholder="Calle 123 #45-67"
                  {...register('direccion')}
                />
                {errors.direccion && (
                  <p className="text-sm text-red-600">{errors.direccion.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Input
                  id="ciudad"
                  placeholder="Bogotá"
                  {...register('ciudad')}
                />
                {errors.ciudad && (
                  <p className="text-sm text-red-600">{errors.ciudad.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País *</Label>
              <Input
                id="pais"
                placeholder="Colombia"
                {...register('pais')}
              />
              {errors.pais && (
                <p className="text-sm text-red-600">{errors.pais.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="foto">Foto de perfil (URL)</Label>
              <Input
                id="foto"
                placeholder="https://ejemplo.com/foto.jpg"
                {...register('foto')}
              />
              {errors.foto && (
                <p className="text-sm text-red-600">{errors.foto.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/profile">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};