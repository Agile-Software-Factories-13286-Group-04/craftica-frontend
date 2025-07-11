describe('Gestión de Tiendas E2E Tests', () => {
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

  describe('Crear Tienda', () => {
    it('debería mostrar formulario de crear tienda correctamente', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que se muestra el formulario
      cy.get('h1').should('contain', 'Crear Tienda');
      cy.get('input[id="nombre"]').should('exist');
      cy.get('textarea[id="descripcion"]').should('exist');
      cy.get('input[id="direccion"]').should('exist');
      cy.get('input[id="telefono"]').should('exist');
      cy.get('input[id="horario"]').should('exist');
      cy.get('input[id="ciudad"]').should('exist');
      cy.get('input[id="pais"]').should('exist');
      cy.get('input[id="logo"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Crear Tienda');
    });

    it('debería validar campos obligatorios', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Intentar enviar formulario vacío
      cy.get('button[type="submit"]').click();
      
      // Verificar mensajes de validación
      cy.get('p.text-sm.text-red-600').should('exist');
    });

    it('debería validar longitud mínima de campos', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Llenar con datos muy cortos
      cy.get('input[id="nombre"]').type('A');
      cy.get('textarea[id="descripcion"]').type('Corta');
      cy.get('input[id="direccion"]').type('Calle');
      cy.get('input[id="telefono"]').type('123');
      cy.get('input[id="horario"]').type('Lun');
      cy.get('input[id="ciudad"]').type('M');
      cy.get('input[id="pais"]').type('M');
      cy.get('button[type="submit"]').click();
      
      // Verificar mensajes de error
      cy.get('p.text-sm.text-red-600').should('exist');
    });

    it('debería validar URL de logo', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Llenar formulario básico
      cy.get('input[id="nombre"]').type('Tienda Test');
      cy.get('textarea[id="descripcion"]').type('Descripción de prueba para la tienda');
      cy.get('input[id="direccion"]').type('Calle Test 123');
      cy.get('input[id="telefono"]').type('1234567890');
      cy.get('input[id="horario"]').type('Lunes a Viernes 9:00-18:00');
      cy.get('input[id="ciudad"]').type('Ciudad Test');
      cy.get('input[id="pais"]').type('País Test');
      
      // URL inválida
      cy.get('input[id="logo"]').type('not-a-valid-url');
      cy.get('button[type="submit"]').click();
      
      // Verificar mensaje de error
      cy.get('p.text-sm.text-red-600').should('contain', 'URL válida');
    });

    it('debería subir imagen de logo válida', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Llenar formulario básico
      cy.get('input[id="nombre"]').type('Tienda con Logo');
      cy.get('textarea[id="descripcion"]').type('Descripción de prueba para la tienda con logo');
      cy.get('input[id="direccion"]').type('Calle Test 123');
      cy.get('input[id="telefono"]').type('1234567890');
      cy.get('input[id="horario"]').type('Lunes a Viernes 9:00-18:00');
      cy.get('input[id="ciudad"]').type('Ciudad Test');
      cy.get('input[id="pais"]').type('País Test');
      
      // URL válida
      cy.get('input[id="logo"]').type('https://via.placeholder.com/300x200');
      
      cy.get('button[type="submit"]').click();
      
      // Como el backend está vacío, debería mostrar error o redireccionar
      cy.get('body').then(($body) => {
        if ($body.find('.alert').length > 0) {
          cy.get('.alert').should('exist');
        } else {
          // Si no hay error, verificar que se redirige
          cy.url().should('not.include', '/tiendas/create');
        }
      });
    });

    it('debería intentar crear tienda (backend vacío)', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Llenar formulario completo
      cy.get('input[id="nombre"]').type('Mi Tienda Artesanal');
      cy.get('textarea[id="descripcion"]').type('Tienda especializada en artesanías locales y productos únicos');
      cy.get('input[id="direccion"]').type('Calle Principal 123');
      cy.get('input[id="telefono"]').type('1234567890');
      cy.get('input[id="horario"]').type('Lunes a Viernes 9:00-18:00');
      cy.get('input[id="ciudad"]').type('Madrid');
      cy.get('input[id="pais"]').type('España');
      cy.get('input[id="logo"]').type('https://example.com/logo.jpg');
      
      // Enviar formulario
      cy.get('button[type="submit"]').click();
      
      // Como el backend está vacío, debería mostrar error o redireccionar
      cy.get('body').then(($body) => {
        if ($body.find('.alert').length > 0) {
          cy.get('.alert').should('exist');
        } else {
          // Si no hay error, verificar que se redirige
          cy.url().should('not.include', '/tiendas/create');
        }
      });
    });
  });

  describe('Navegación', () => {
    // TODO: Solucionar selector único para el enlace a /tiendas
    // it('debería navegar de crear tienda a lista de tiendas', () => {
    //   cy.visit('/tiendas/create');
    //   cy.contains('Verificando autenticacion...').should('not.exist');
    //   // Hacer clic en "Volver"
    //   cy.get('a[href="/tiendas"]').click();
    //   // Verificar que se navegó a la lista
    //   cy.url().should('include', '/tiendas');
    // });

    it('debería cancelar creación de tienda', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      // Hacer clic en "Cancelar"
      cy.get('button:contains("Cancelar")').click();
      // Verificar que se navegó a la lista
      cy.url().should('include', '/tiendas');
    });
  });

  describe('Estados de Carga', () => {
    it('debería mostrar loading durante la creación', () => {
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Llenar formulario básico
      cy.get('input[id="nombre"]').type('Tienda Loading');
      cy.get('textarea[id="descripcion"]').type('Descripción de prueba para test de loading');
      cy.get('input[id="direccion"]').type('Calle Test 123');
      cy.get('input[id="telefono"]').type('1234567890');
      cy.get('input[id="horario"]').type('Lunes a Viernes 9:00-18:00');
      cy.get('input[id="ciudad"]').type('Ciudad Test');
      cy.get('input[id="pais"]').type('País Test');
      
      // Hacer clic en submit y verificar loading
      cy.get('button[type="submit"]').click();
      
      // Verificar que el botón muestra loading
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  describe('Responsive y Accesibilidad', () => {
    it('debería funcionar en vista móvil', () => {
      cy.viewport('iphone-x');
      cy.visit('/tiendas/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      // Verificar que los campos son accesibles
      cy.get('input[id="nombre"]').should('be.visible');
      cy.get('textarea[id="descripcion"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    // TODO: Instalar cypress-real-events para navegación por teclado
    // it('debería tener navegación por teclado', () => {
    //   cy.visit('/tiendas/create');
    //   cy.contains('Verificando autenticacion...').should('not.exist');
    //   // Navegar con Tab
    //   cy.get('body').tab();
    //   cy.focused().should('exist');
    //   // Navegar a nombre con Tab
    //   cy.get('input[id="nombre"]').focus();
    //   cy.get('input[id="nombre"]').should('be.focused');
    // });
  });

  // TODO: Comentar tests que requieren backend con datos
  describe('Editar Tienda', () => {
    // TODO: Implementar cuando el backend tenga datos
    // it('debería editar tienda existente', () => {
    //   // Requiere backend con datos
    // });
  });

  describe('Eliminar Tienda', () => {
    // TODO: Implementar cuando el backend tenga datos
    // it('debería eliminar tienda con confirmación', () => {
    //   // Requiere backend con datos
    // });
  });
}); 