'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
  nombres: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
  correo: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmarPassword: z.string(),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  ciudad: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  pais: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
  foto: z.string().optional(),
}).refine((data) => data.password === data.confirmarPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register: registerUser, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setSubmitError(null);
      const { confirmarPassword, ...formData } = data;
      
      // Transformar los datos al formato esperado por el backend
      const registerData = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        foto: formData.foto,
        credencial: {
          correo: formData.correo,
          password: formData.password,
        },
        localidad: {
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          pais: formData.pais,
        },
      };
      
      await registerUser(registerData);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al registrarse');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>
          Completa el formulario para registrarte en Craftica
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {(error || submitError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || submitError}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombre</Label>
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
              <Label htmlFor="apellidos">Apellidos</Label>
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
            <Label htmlFor="correo">Correo electrónico</Label>
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

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              placeholder="1234567890"
              {...register('telefono')}
            />
            {errors.telefono && (
              <p className="text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
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
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                placeholder="Bogotá"
                {...register('ciudad')}
              />
              {errors.ciudad && (
                <p className="text-sm text-red-600">{errors.ciudad.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                placeholder="Colombia"
                {...register('pais')}
              />
              {errors.pais && (
                <p className="text-sm text-red-600">{errors.pais.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="foto">Foto de perfil (opcional)</Label>
            <Input
              id="foto"
              placeholder="https://ejemplo.com/foto.jpg"
              {...register('foto')}
            />
            {errors.foto && (
              <p className="text-sm text-red-600">{errors.foto.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmarPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirmarPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmarPassword')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmarPassword && (
              <p className="text-sm text-red-600">{errors.confirmarPassword.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Crear Cuenta
          </Button>
          <p className="text-sm text-center text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};