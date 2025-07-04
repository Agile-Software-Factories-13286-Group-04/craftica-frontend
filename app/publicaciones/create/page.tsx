'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useTiendas } from '@/hooks/useTiendas';
import { publicacionesAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, MessageSquare, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const publicacionSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  contenido: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
  tienda_id: z.string().min(1, 'Selecciona una tienda'),
  imagenes: z.array(z.string().url('Debe ser una URL válida')).optional(),
});

type PublicacionFormData = z.infer<typeof publicacionSchema>;

export default function CreatePublicacionPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <CreatePublicacionContent />
      </Layout>
    </ProtectedRoute>
  );
}

const CreatePublicacionContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { tiendas } = useTiendas({ limit: 100 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PublicacionFormData>({
    resolver: zodResolver(publicacionSchema),
  });

  const selectedTienda = watch('tienda_id');

  const handleAddImage = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      const updatedImages = [...imageUrls, newImageUrl];
      setImageUrls(updatedImages);
      setValue('imagenes', updatedImages);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    setValue('imagenes', updatedImages.length > 0 ? updatedImages : undefined);
  };

  const onSubmit = async (data: PublicacionFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const publicacionData = {
        ...data,
        fecha_publicacion: new Date().toISOString(),
        imagenes: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const response = await publicacionesAPI.create(publicacionData);
      
      toast.success('Publicación creada exitosamente');
      router.push(`/publicaciones/${response.data.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la publicación';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar tiendas del usuario actual
  const userTiendas = tiendas.filter(tienda => tienda.usuario_id === user?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/publicaciones">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crear Publicación</h1>
            <p className="mt-2 text-gray-600">
              Comparte novedades, promociones y actualizaciones con tus clientes
            </p>
          </div>
        </div>
      </div>

      {/* Check if user has stores */}
      {userTiendas.length === 0 && (
        <Alert className="mb-6">
          <AlertDescription>
            Necesitas crear una tienda antes de hacer publicaciones.{' '}
            <Link href="/tiendas/create" className="text-primary hover:underline">
              Crear tienda
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Información de la Publicación
          </CardTitle>
          <CardDescription>
            Comparte contenido interesante con tu audiencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="tienda_id">Tienda *</Label>
              <Select value={selectedTienda} onValueChange={(value) => setValue('tienda_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una tienda" />
                </SelectTrigger>
                <SelectContent>
                  {userTiendas.map((tienda) => (
                    <SelectItem key={tienda.id} value={tienda.id}>
                      {tienda.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tienda_id && (
                <p className="text-sm text-red-600">{errors.tienda_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Título de tu publicación"
                {...register('titulo')}
              />
              {errors.titulo && (
                <p className="text-sm text-red-600">{errors.titulo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido *</Label>
              <Textarea
                id="contenido"
                placeholder="Escribe el contenido de tu publicación..."
                rows={8}
                {...register('contenido')}
              />
              {errors.contenido && (
                <p className="text-sm text-red-600">{errors.contenido.message}</p>
              )}
            </div>

            {/* Image Management */}
            <div className="space-y-4">
              <Label>Imágenes</Label>
              
              {/* Add Image URL */}
              <div className="flex gap-2">
                <Input
                  placeholder="URL de la imagen"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  disabled={!newImageUrl}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Image List */}
              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                        {url}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/publicaciones">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading || userTiendas.length === 0}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Creando...
                  </>
                ) : (
                  'Crear Publicación'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};