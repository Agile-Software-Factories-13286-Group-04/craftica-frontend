describe('Flujos Complejos y Casos Edge E2E Tests', () => {
  beforeEach(() => {
    // Simular usuario autenticado
    cy.window().then((win) => {
      win.localStorage.setItem('craftica_token', 'mock-token');
      win.localStorage.setItem('craftica_user', JSON.stringify({
        id: '1',
        nombre: 'Test User',
        correo: 'test@test.com'
      }));
    });
  });

  describe('Flujos Complejos de Usuario', () => {
    it('debería completar flujo completo de marketplace', () => {
      // 1. Crear tienda
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[name="nombre"]').type('Tienda Marketplace');
      cy.get('textarea[name="descripcion"]').type('Tienda especializada en artesanías');
      cy.get('input[name="direccion"]').type('Calle Artesanal 456');
      cy.get('input[name="telefono"]').type('987654321');
      cy.get('input[name="horario"]').type('Lunes a Sábado 10:00-20:00');
      cy.get('input[name="ciudad"]').type('Barcelona');
      cy.get('input[name="pais"]').type('España');
      cy.get('button[type="submit"]').click();
      
      // 2. Crear múltiples productos
      const productos = [
        { nombre: 'Jarrón Artesanal', precio: '45.00', categoria: 'Artesanías' },
        { nombre: 'Mantel Bordado', precio: '35.50', categoria: 'Textiles' },
        { nombre: 'Collar de Plata', precio: '120.00', categoria: 'Joyería' }
      ];
      
      productos.forEach((producto, index) => {
        cy.visit('/productos/create');
        cy.get('input[name="nombre"]').type(producto.nombre);
        cy.get('textarea[name="descripcion"]').type(`Descripción de ${producto.nombre}`);
        cy.get('input[name="precio"]').type(producto.precio);
        cy.get('select[name="categoria"]').select(producto.categoria);
        cy.get('select[name="tienda_id"]').select('1');
        cy.get('button[type="submit"]').click();
        
        // Verificar producto creado
        cy.get('h1').should('contain', producto.nombre);
      });
      
      // 3. Crear publicaciones promocionales
      cy.visit('/publicaciones/create');
      cy.get('input[name="titulo"]').type('Nuevas Artesanías Disponibles');
      cy.get('textarea[name="contenido"]').type('Descubre nuestras nuevas artesanías únicas');
      cy.get('select[name="tienda_id"]').select('1');
      cy.get('button[type="submit"]').click();
      
      // 4. Explorar como cliente
      cy.visit('/tiendas');
      cy.get('input[placeholder*="ciudad"]').type('Barcelona');
      cy.get('button[type="submit"]').click();
      
      // Verificar que aparece la tienda
      cy.get('.card').should('contain', 'Tienda Marketplace');
    });

    it('debería manejar múltiples tiendas y productos', () => {
      // Crear primera tienda
      cy.visit('/tiendas/create');
      cy.get('input[name="nombre"]').type('Tienda 1');
      cy.get('textarea[name="descripcion"]').type('Primera tienda');
      cy.get('input[name="direccion"]').type('Dirección 1');
      cy.get('input[name="telefono"]').type('111111111');
      cy.get('input[name="horario"]').type('Horario 1');
      cy.get('input[name="ciudad"]').type('Madrid');
      cy.get('input[name="pais"]').type('España');
      cy.get('button[type="submit"]').click();
      
      // Crear segunda tienda
      cy.visit('/tiendas/create');
      cy.get('input[name="nombre"]').type('Tienda 2');
      cy.get('textarea[name="descripcion"]').type('Segunda tienda');
      cy.get('input[name="direccion"]').type('Dirección 2');
      cy.get('input[name="telefono"]').type('222222222');
      cy.get('input[name="horario"]').type('Horario 2');
      cy.get('input[name="ciudad"]').type('Barcelona');
      cy.get('input[name="pais"]').type('España');
      cy.get('button[type="submit"]').click();
      
      // Verificar que ambas tiendas existen
      cy.visit('/tiendas');
      cy.get('.card').should('contain', 'Tienda 1');
      cy.get('.card').should('contain', 'Tienda 2');
    });

    it('debería completar flujo de búsqueda avanzada', () => {
      // Crear tiendas con diferentes características
      const tiendas = [
        { nombre: 'Artesanías Madrid', ciudad: 'Madrid', pais: 'España' },
        { nombre: 'Textiles Barcelona', ciudad: 'Barcelona', pais: 'España' },
        { nombre: 'Joyería Valencia', ciudad: 'Valencia', pais: 'España' }
      ];
      
      tiendas.forEach((tienda) => {
        cy.visit('/tiendas/create');
        cy.get('input[name="nombre"]').type(tienda.nombre);
        cy.get('textarea[name="descripcion"]').type(`Descripción de ${tienda.nombre}`);
        cy.get('input[name="direccion"]').type('Dirección');
        cy.get('input[name="telefono"]').type('123456789');
        cy.get('input[name="horario"]').type('Horario');
        cy.get('input[name="ciudad"]').type(tienda.ciudad);
        cy.get('input[name="pais"]').type(tienda.pais);
        cy.get('button[type="submit"]').click();
      });
      
      // Realizar búsqueda avanzada
      cy.visit('/tiendas');
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Verificar resultados filtrados
      cy.get('.card').should('contain', 'Artesanías Madrid');
      cy.get('.card').should('not.contain', 'Textiles Barcelona');
    });
  });

  describe('Casos Edge y Manejo de Errores', () => {
    it('debería manejar formularios con datos muy largos', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Llenar con datos muy largos
      const nombreLargo = 'A'.repeat(100);
      const descripcionLarga = 'B'.repeat(1000);
      
      cy.get('input[name="nombre"]').type(nombreLargo);
      cy.get('textarea[name="descripcion"]').type(descripcionLarga);
      cy.get('input[name="direccion"]').type('Dirección normal');
      cy.get('input[name="telefono"]').type('123456789');
      cy.get('input[name="horario"]').type('Horario normal');
      cy.get('input[name="ciudad"]').type('Ciudad normal');
      cy.get('input[name="pais"]').type('País normal');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se maneja correctamente
      cy.url().should('include', '/tiendas/');
    });

    it('debería manejar caracteres especiales', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Usar caracteres especiales
      cy.get('input[name="nombre"]').type('Tienda con ñáéíóú');
      cy.get('textarea[name="descripcion"]').type('Descripción con símbolos: @#$%&*()');
      cy.get('input[name="direccion"]').type('Calle con números 123-456');
      cy.get('input[name="telefono"]').type('123-456-789');
      cy.get('input[name="horario"]').type('Lunes a Viernes 9:00-18:00');
      cy.get('input[name="ciudad"]').type('Ciudad con espacios');
      cy.get('input[name="pais"]').type('País con acentos');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se guarda correctamente
      cy.url().should('include', '/tiendas/');
      cy.get('h1').should('contain', 'Tienda con ñáéíóú');
    });

    it('debería manejar URLs de imagen inválidas', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Llenar formulario básico
      cy.get('input[name="nombre"]').type('Tienda con URL inválida');
      cy.get('textarea[name="descripcion"]').type('Descripción');
      cy.get('input[name="direccion"]').type('Dirección');
      cy.get('input[name="telefono"]').type('123456789');
      cy.get('input[name="horario"]').type('Horario');
      cy.get('input[name="ciudad"]').type('Ciudad');
      cy.get('input[name="pais"]').type('País');
      
      // URL inválida
      cy.get('input[name="logo"]').type('not-a-valid-url');
      cy.get('button[type="submit"]').click();
      
      // Verificar validación
      cy.get('input[name="logo"]').should('have.attr', 'aria-invalid', 'true');
    });

    it('debería manejar pérdida de conexión', () => {
      // Interceptar llamadas para simular pérdida de conexión
      cy.intercept('POST', '/api/tiendas', { forceNetworkError: true }).as('createTienda');
      
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[name="nombre"]').type('Tienda Test');
      cy.get('textarea[name="descripcion"]').type('Descripción');
      cy.get('input[name="direccion"]').type('Dirección');
      cy.get('input[name="telefono"]').type('123456789');
      cy.get('input[name="horario"]').type('Horario');
      cy.get('input[name="ciudad"]').type('Ciudad');
      cy.get('input[name="pais"]').type('País');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@createTienda');
      
      // Verificar que se muestra mensaje de error
      cy.get('.error, .alert, [data-testid="error"]').should('exist');
    });
  });

  describe('Rendimiento y Carga', () => {
    it('debería manejar listas grandes de tiendas', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que se cargan las tiendas
      cy.get('.card, [data-testid="tienda-card"]').should('exist');
      
      // Verificar paginación si existe
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Siguiente")').length > 0) {
          cy.get('button:contains("Siguiente")').click();
          cy.get('.card').should('exist');
        }
      });
    });

    it('debería manejar carga de imágenes', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Subir imagen grande
      cy.get('input[name="logo"]').type('https://via.placeholder.com/2000x1500');
      
      cy.get('input[name="nombre"]').type('Tienda con Imagen Grande');
      cy.get('textarea[name="descripcion"]').type('Descripción');
      cy.get('input[name="direccion"]').type('Dirección');
      cy.get('input[name="telefono"]').type('123456789');
      cy.get('input[name="horario"]').type('Horario');
      cy.get('input[name="ciudad"]').type('Ciudad');
      cy.get('input[name="pais"]').type('País');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se procesa correctamente
      cy.url().should('include', '/tiendas/');
    });
  });

  describe('Concurrencia y Estados', () => {
    it('debería manejar múltiples pestañas', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Abrir nueva pestaña
      cy.window().then((win) => {
        win.open('/productos', '_blank');
      });
      
      // Verificar que ambas pestañas funcionan
      cy.url().should('include', '/tiendas');
    });

    it('debería mantener estado entre navegaciones', () => {
      // Aplicar filtro en tiendas
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Navegar a productos
      cy.get('a[href="/productos"]').click();
      
      // Regresar a tiendas
      cy.get('a[href="/tiendas"]').click();
      
      // Verificar que se mantiene el filtro
      cy.get('input[placeholder*="ciudad"]').should('have.value', 'Madrid');
    });

    it('debería manejar recarga de página', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Llenar formulario parcialmente
      cy.get('input[name="nombre"]').type('Tienda Test');
      cy.get('textarea[name="descripcion"]').type('Descripción');
      
      // Recargar página
      cy.reload();
      
      // Verificar que se mantiene la autenticación
      cy.contains('Verificando autenticacion...').should('not.exist');
    });
  });

  describe('Validaciones Avanzadas', () => {
    it('debería validar formato de teléfono', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[name="nombre"]').type('Tienda Test');
      cy.get('textarea[name="descripcion"]').type('Descripción');
      cy.get('input[name="direccion"]').type('Dirección');
      cy.get('input[name="telefono"]').type('abc'); // Teléfono inválido
      cy.get('input[name="horario"]').type('Horario');
      cy.get('input[name="ciudad"]').type('Ciudad');
      cy.get('input[name="pais"]').type('País');
      cy.get('button[type="submit"]').click();
      
      cy.get('input[name="telefono"]').should('have.attr', 'aria-invalid', 'true');
    });

    it('debería validar precio con decimales', () => {
      cy.visit('/productos/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[name="nombre"]').type('Producto Test');
      cy.get('textarea[name="descripcion"]').type('Descripción');
      cy.get('input[name="precio"]').type('25.999'); // Demasiados decimales
      cy.get('select[name="categoria"]').select('Artesanías');
      cy.get('select[name="tienda_id"]').select('1');
      cy.get('button[type="submit"]').click();
      
      cy.get('input[name="precio"]').should('have.attr', 'aria-invalid', 'true');
    });

    it('debería validar longitud de campos', () => {
      cy.visit('/publicaciones/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Título muy corto
      cy.get('input[name="titulo"]').type('A');
      cy.get('textarea[name="contenido"]').type('Contenido normal');
      cy.get('select[name="tienda_id"]').select('1');
      cy.get('button[type="submit"]').click();
      
      cy.get('input[name="titulo"]').should('have.attr', 'aria-invalid', 'true');
    });
  });

  describe('Integración Completa', () => {
    it('debería completar flujo completo de usuario nuevo', () => {
      // 1. Registro de usuario
      cy.visit('/register');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[name="nombres"]').type('Usuario Nuevo');
      cy.get('input[name="apellidos"]').type('Apellido');
      cy.get('input[name="correo"]').type('usuario.nuevo@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      // 2. Crear tienda
      cy.visit('/tiendas/create');
      cy.get('input[name="nombre"]').type('Mi Primera Tienda');
      cy.get('textarea[name="descripcion"]').type('Descripción de mi primera tienda');
      cy.get('input[name="direccion"]').type('Mi Dirección');
      cy.get('input[name="telefono"]').type('123456789');
      cy.get('input[name="horario"]').type('Horario de trabajo');
      cy.get('input[name="ciudad"]').type('Mi Ciudad');
      cy.get('input[name="pais"]').type('Mi País');
      cy.get('button[type="submit"]').click();
      
      // 3. Crear producto
      cy.get('a[href="/productos/create"]').click();
      cy.get('input[name="nombre"]').type('Mi Primer Producto');
      cy.get('textarea[name="descripcion"]').type('Descripción del producto');
      cy.get('input[name="precio"]').type('29.99');
      cy.get('select[name="categoria"]').select('Artesanías');
      cy.get('button[type="submit"]').click();
      
      // 4. Crear publicación
      cy.get('a[href="/publicaciones/create"]').click();
      cy.get('input[name="titulo"]').type('Mi Primera Publicación');
      cy.get('textarea[name="contenido"]').type('Contenido de mi primera publicación');
      cy.get('button[type="submit"]').click();
      
      // 5. Verificar que todo está funcionando
      cy.visit('/');
      cy.get('h1').should('contain', 'Dashboard');
    });
  });
}); 