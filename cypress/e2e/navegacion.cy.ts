describe('Navegación y Flujos E2E Tests', () => {
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

  describe('Navegación Principal', () => {
    it('debería navegar entre páginas principales', () => {
      cy.visit('/');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Navegar a Tiendas
      cy.get('a[href="/tiendas"], nav a:contains("Tiendas")').click();
      cy.url().should('include', '/tiendas');
      cy.get('h1').should('contain', 'Tiendas');
      
      // Navegar a Productos
      cy.get('a[href="/productos"], nav a:contains("Productos")').click();
      cy.url().should('include', '/productos');
      cy.get('h1').should('contain', 'Productos');
      
      // Navegar a Publicaciones
      cy.get('a[href="/publicaciones"], nav a:contains("Publicaciones")').click();
      cy.url().should('include', '/publicaciones');
      cy.get('h1').should('contain', 'Publicaciones');
      
      // Navegar a Perfil
      cy.get('a[href="/profile"], nav a:contains("Perfil")').click();
      cy.url().should('include', '/profile');
      cy.get('h1').should('contain', 'Perfil');
    });

    it('debería mantener estado de navegación', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Aplicar filtro
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Navegar a otra página
      cy.get('a[href="/productos"]').click();
      
      // Regresar a tiendas
      cy.get('a[href="/tiendas"]').click();
      
      // Verificar que se mantiene el filtro
      cy.get('input[placeholder*="ciudad"]').should('have.value', 'Madrid');
    });

    it('debería mostrar breadcrumbs correctos', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar breadcrumb en lista
      cy.get('.breadcrumb, [data-testid="breadcrumb"]').should('contain', 'Tiendas');
      
      // Navegar a crear tienda
      cy.get('a[href="/tiendas/create"]').click();
      cy.get('.breadcrumb, [data-testid="breadcrumb"]').should('contain', 'Crear Tienda');
    });
  });

  describe('Flujos de Usuario', () => {
    it('debería completar flujo completo de crear tienda y producto', () => {
      // 1. Crear tienda
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[name="nombre"]').type('Mi Tienda Completa');
      cy.get('textarea[name="descripcion"]').type('Descripción de la tienda');
      cy.get('input[name="direccion"]').type('Calle Principal 123');
      cy.get('input[name="telefono"]').type('123456789');
      cy.get('input[name="horario"]').type('Lunes a Viernes 9:00-18:00');
      cy.get('input[name="ciudad"]').type('Madrid');
      cy.get('input[name="pais"]').type('España');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se creó la tienda
      cy.url().should('include', '/tiendas/');
      cy.get('h1').should('contain', 'Mi Tienda Completa');
      
      // 2. Crear producto para esta tienda
      cy.get('a[href="/productos/create"]').click();
      
      cy.get('input[name="nombre"]').type('Producto de Mi Tienda');
      cy.get('textarea[name="descripcion"]').type('Descripción del producto');
      cy.get('input[name="precio"]').type('29.99');
      cy.get('select[name="categoria"]').select('Artesanías');
      cy.get('select[name="tienda_id"]').should('have.value', '1'); // Debería estar preseleccionada
      cy.get('button[type="submit"]').click();
      
      // Verificar que se creó el producto
      cy.url().should('include', '/productos/');
      cy.get('h1').should('contain', 'Producto de Mi Tienda');
    });

    it('debería completar flujo de búsqueda y exploración', () => {
      // 1. Ir a búsqueda de tiendas
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // 2. Buscar tiendas
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // 3. Verificar resultados
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          // 4. Navegar a detalles de primera tienda
          cy.get('.card').first().within(() => {
            cy.get('a[href*="/tiendas/"]').click();
          });
          
          // 5. Verificar detalles de tienda
          cy.url().should('include', '/tiendas/');
          cy.get('h1, h2').should('exist');
          
          // 6. Ver productos de la tienda
          cy.get('a[href*="/productos"], button:contains("Ver Productos")').click();
          
          // 7. Verificar lista de productos
          cy.url().should('include', '/productos');
          cy.get('h1').should('contain', 'Productos');
        }
      });
    });

    it('debería completar flujo de publicación y interacción', () => {
      // 1. Crear publicación
      cy.visit('/publicaciones/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[name="titulo"]').type('Publicación de Prueba');
      cy.get('textarea[name="contenido"]').type('Contenido de la publicación');
      cy.get('select[name="tienda_id"]').select('1');
      cy.get('button[type="submit"]').click();
      
      // 2. Verificar publicación creada
      cy.url().should('include', '/publicaciones/');
      cy.get('h1').should('contain', 'Publicación de Prueba');
      
      // 3. Interactuar con la publicación
      cy.get('button:contains("Like"), [data-testid="like-button"]').click();
      
      // 4. Agregar comentario
      cy.get('textarea[placeholder*="comentario"], input[name="comentario"]').type('Excelente publicación');
      cy.get('button:contains("Comentar"), [data-testid="comment-button"]').click();
      
      // 5. Verificar interacciones
      cy.get('.comentario, .comment').should('contain', 'Excelente publicación');
    });
  });

  describe('Responsive y Mobile', () => {
    it('debería funcionar en vista móvil', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que el menú móvil funciona
      cy.get('button[aria-label*="menu"], [data-testid="mobile-menu"]').click();
      cy.get('nav, .mobile-menu').should('be.visible');
      
      // Navegar usando menú móvil
      cy.get('a[href="/tiendas"]').click();
      cy.url().should('include', '/tiendas');
    });

    it('debería mostrar formularios correctamente en móvil', () => {
      cy.viewport('iphone-x');
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que los campos son accesibles
      cy.get('input[name="nombre"]').should('be.visible');
      cy.get('textarea[name="descripcion"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  });

  describe('Accesibilidad', () => {
    it('debería tener navegación por teclado', () => {
      cy.visit('/');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Navegar con Tab
      cy.get('body').tab();
      cy.focused().should('exist');
      
      // Navegar a tiendas con Enter
      cy.get('a[href="/tiendas"]').focus();
      cy.get('a[href="/tiendas"]').type('{enter}');
      cy.url().should('include', '/tiendas');
    });

    it('debería tener atributos ARIA correctos', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar atributos ARIA
      cy.get('nav').should('have.attr', 'role', 'navigation');
      cy.get('main').should('have.attr', 'role', 'main');
      cy.get('button[type="submit"]').should('have.attr', 'type', 'submit');
    });
  });

  describe('Estados de Carga', () => {
    it('debería mostrar loading states', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que se muestra loading al cargar
      cy.get('.loading, .spinner, [data-testid="loading"]').should('exist');
      
      // Verificar que desaparece el loading
      cy.get('.loading, .spinner, [data-testid="loading"]').should('not.exist');
    });

    it('debería manejar errores de red', () => {
      // Interceptar llamadas a la API para simular error
      cy.intercept('GET', '/api/tiendas', { statusCode: 500 }).as('getTiendas');
      
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.wait('@getTiendas');
      
      // Verificar que se muestra mensaje de error
      cy.get('.error, .alert, [data-testid="error"]').should('exist');
    });
  });

  describe('Persistencia de Estado', () => {
    it('debería mantener filtros en localStorage', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Aplicar filtro
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Recargar página
      cy.reload();
      
      // Verificar que se mantiene el filtro
      cy.get('input[placeholder*="ciudad"]').should('have.value', 'Madrid');
    });

    it('debería mantener estado de autenticación', () => {
      // Simular login
      cy.window().then((win) => {
        win.localStorage.setItem('craftica_token', 'mock-token');
        win.localStorage.setItem('craftica_user', JSON.stringify({
          id: '1',
          nombre: 'Test User',
          correo: 'test@test.com'
        }));
      });
      
      cy.visit('/');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que está autenticado
      cy.get('button:contains("Cerrar"), [data-testid="logout"]').should('exist');
    });
  });

  describe('Navegación con Browser', () => {
    it('debería funcionar botones atrás/adelante', () => {
      cy.visit('/');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Navegar a tiendas
      cy.get('a[href="/tiendas"]').click();
      cy.url().should('include', '/tiendas');
      
      // Navegar a productos
      cy.get('a[href="/productos"]').click();
      cy.url().should('include', '/productos');
      
      // Usar botón atrás
      cy.go('back');
      cy.url().should('include', '/tiendas');
      
      // Usar botón adelante
      cy.go('forward');
      cy.url().should('include', '/productos');
    });

    it('debería actualizar URL correctamente', () => {
      cy.visit('/');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que la URL se actualiza al navegar
      cy.get('a[href="/tiendas"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/tiendas');
      
      cy.get('a[href="/productos"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/productos');
    });
  });
}); 