import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Craftica</h3>
            <p className="text-gray-600 text-sm">
              Plataforma para conectar artesanos y pequeñas empresas con sus clientes.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tiendas" className="text-gray-600 hover:text-primary">Tiendas</Link></li>
              <li><Link href="/productos" className="text-gray-600 hover:text-primary">Productos</Link></li>
              <li><Link href="/publicaciones" className="text-gray-600 hover:text-primary">Publicaciones</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Cuenta</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/profile" className="text-gray-600 hover:text-primary">Mi Perfil</Link></li>
              <li><Link href="/tiendas/create" className="text-gray-600 hover:text-primary">Crear Tienda</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@craftica.com" className="text-gray-600 hover:text-primary">Contacto</a></li>
              <li><a href="/help" className="text-gray-600 hover:text-primary">Ayuda</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2024 Craftica. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};