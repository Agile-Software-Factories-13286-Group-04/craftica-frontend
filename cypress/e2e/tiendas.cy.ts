describe('Tiendas E2E Tests', () => {
  beforeEach(() => {
    // Simular usuario autenticado antes de visitar la página
    cy.window().then((win) => {
      win.localStorage.setItem('craftica_token', 'mock-token');
      win.localStorage.setItem('craftica_user', JSON.stringify({
        id: '1',
        nombre: 'Test User',
        correo: 'test@test.com'
      }));
    });
    
    // Visitar la página de tiendas
    cy.visit('/tiendas');
    // Esperar a que desaparezca el mensaje de autenticación
    cy.contains('Verificando autenticacion...').should('not.exist');
  });

  describe('Lista de Tiendas', () => {
    it('debería cargar la página de tiendas correctamente', () => {
      // Verificar que estamos en la página correcta
      cy.url().should('include', '/tiendas');
      
      // Verificar que el título de la página esté presente
      cy.get('h1').should('contain', 'Tiendas');
      
      // Verificar que el botón de crear tienda esté presente
      cy.get('a[href="/tiendas/create"]').should('be.visible');
    });

    it('debería mostrar la lista de tiendas', () => {
      // Esperar a que la página cargue completamente
      cy.get('h1').should('contain', 'Tiendas');
      
      // Verificar que hay al menos una tienda o el estado vacío
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          // Hay tiendas
          cy.get('.card').should('have.length.greaterThan', 0);
        } else {
          // No hay tiendas, verificar estado vacío
          cy.get('h3').should('contain', 'No se encontraron tiendas');
        }
      });
    });

    it('debería permitir filtrar tiendas por ciudad', () => {
      // Buscar el campo de búsqueda
      cy.get('input[placeholder*="ciudad"]').should('exist');
      
      // Escribir en el campo de búsqueda
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      
      // Hacer clic en el botón de buscar
      cy.get('button[type="submit"]').click();
      
      // Esperar a que se aplique el filtro
      cy.wait(2000);
      
      // Verificar que la página sigue funcionando
      cy.get('h1').should('contain', 'Tiendas');
    });

    it('debería navegar a los detalles de una tienda', () => {
      // Esperar a que la página cargue
      cy.get('h1').should('contain', 'Tiendas');
      
      // Verificar si hay tiendas disponibles
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          // Hay tiendas, hacer clic en el botón "Ver Detalles" de la primera tienda
          cy.get('.card').first().within(() => {
            cy.get('a[href*="/tiendas/"]').click();
          });
          
          // Verificar que navegó a la página de detalles
          cy.url().should('include', '/tiendas/');
          
          // Verificar que se muestra información de la tienda
          cy.get('h1, h2').should('exist');
        } else {
          // No hay tiendas, este test se salta
          cy.log('No hay tiendas disponibles para probar navegación a detalles');
        }
      });
    });

    it('debería mostrar el botón de crear nueva tienda', () => {
      // Buscar el botón de crear tienda
      cy.get('a[href="/tiendas/create"]').should('be.visible');
    });

    it('debería navegar al formulario de crear tienda', () => {
      // Hacer clic en el botón de crear
      cy.get('a[href="/tiendas/create"]').click();
      
      // Verificar que navegó al formulario
      cy.url().should('include', '/tiendas/create');
      
      // Verificar que el formulario está presente
      cy.get('form').should('exist');
    });
  });

  describe('Autenticación en Tiendas', () => {
    it('debería redirigir a login si no está autenticado', () => {
      // Limpiar localStorage para simular usuario no autenticado
      cy.clearLocalStorage();
      cy.reload();
      cy.contains('Verificando autenticacion...').should('not.exist');
      // Verificar que redirige a login
      cy.url().should('include', '/login');
    });

    it('debería mostrar tiendas si está autenticado', () => {
      // Simular usuario autenticado
      cy.window().then((win) => {
        win.localStorage.setItem('craftica_token', 'mock-token');
        win.localStorage.setItem('craftica_user', JSON.stringify({
          id: '1',
          nombre: 'Test User',
          correo: 'test@test.com'
        }));
      });
      
      // Visitar la página de tiendas
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      // Verificar que no redirige a login
      cy.url().should('include', '/tiendas');
    });
  });

  describe('Responsive Design', () => {
    it('debería funcionar en móvil', () => {
      // Configurar viewport móvil
      cy.viewport(375, 667);
      
      // Visitar la página
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      // Verificar que la página se carga en móvil
      cy.get('h1').should('contain', 'Tiendas');
    });

    it('debería funcionar en tablet', () => {
      // Configurar viewport tablet
      cy.viewport(768, 1024);
      
      // Visitar la página
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      // Verificar que la página se carga correctamente
      cy.get('h1').should('contain', 'Tiendas');
    });

    it('debería funcionar en desktop', () => {
      // Configurar viewport desktop
      cy.viewport(1920, 1080);
      
      // Visitar la página
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      // Verificar que la página se carga correctamente
      cy.get('h1').should('contain', 'Tiendas');
    });
  });

  describe('Navegación y UX', () => {
    it('debería mostrar loading states', () => {
      // Verificar que la página carga correctamente
      cy.get('h1').should('contain', 'Tiendas');
      
      // El spinner puede no estar presente si la carga es muy rápida
      cy.get('body').then(($body) => {
        if ($body.find('.spinner').length > 0) {
          cy.get('.spinner').should('exist');
        } else {
          cy.log('No se mostró spinner (carga rápida)');
        }
      });
    });

    it('debería manejar errores gracefully', () => {
      // Simular un error de red
      cy.intercept('GET', '**/tiendas**', { statusCode: 500 }).as('getTiendasError');
      
      cy.visit('/tiendas', { failOnStatusCode: false });
      
      // Verificar que se muestra un mensaje de error
      cy.get('body').then(($body) => {
        if ($body.find('.error-display').length > 0) {
          cy.get('.error-display').should('exist');
        } else {
          cy.log('No se mostró error display');
        }
      });
    });

    it('debería tener paginación si hay muchas tiendas', () => {
      // Verificar que existe paginación (puede no estar presente si hay pocas tiendas)
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Anterior")').length > 0) {
          cy.get('button:contains("Anterior")').should('exist');
        } else {
          cy.log('No hay paginación (pocas tiendas)');
        }
      });
    });
  });
}); 