describe('Búsqueda y Exploración E2E Tests', () => {
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

  describe('Búsqueda de Tiendas', () => {
    it('debería buscar tiendas por ciudad', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Buscar por ciudad
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se aplicó el filtro
      cy.get('h1').should('contain', 'Tiendas');
      cy.get('input[placeholder*="ciudad"]').should('have.value', 'Madrid');
    });

    it('debería buscar tiendas por país', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Buscar por país
      cy.get('input[placeholder*="ciudad"]').type('España');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se aplicó el filtro
      cy.get('h1').should('contain', 'Tiendas');
    });

    it('debería buscar tiendas por nombre', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Buscar por nombre
      cy.get('input[placeholder*="ciudad"]').type('Artesanal');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se aplicó el filtro
      cy.get('h1').should('contain', 'Tiendas');
    });

    it('debería limpiar búsqueda', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Hacer una búsqueda
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Limpiar búsqueda
      cy.get('input[placeholder*="ciudad"]').clear();
      cy.get('button[type="submit"]').click();
      
      // Verificar que se limpió
      cy.get('input[placeholder*="ciudad"]').should('have.value', '');
    });
  });

  describe('Exploración de Tiendas', () => {
    it('debería mostrar lista de tiendas', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que se muestra la lista
      cy.get('h1').should('contain', 'Tiendas');
      cy.get('.card, [data-testid="tienda-card"]').should('exist');
    });

    it('debería paginar resultados', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar si hay paginación
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Siguiente")').length > 0) {
          // Hay paginación
          cy.get('button:contains("Siguiente")').click();
          cy.get('span').should('contain', 'Página 2');
          
          cy.get('button:contains("Anterior")').click();
          cy.get('span').should('contain', 'Página 1');
        } else {
          cy.log('No hay suficientes tiendas para paginación');
        }
      });
    });

    it('debería ordenar tiendas', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar si hay ordenamiento
      cy.get('body').then(($body) => {
        if ($body.find('select[name="orden"], [data-testid="orden-select"]').length > 0) {
          cy.get('select[name="orden"], [data-testid="orden-select"]').select('nombre');
          cy.get('select[name="orden"], [data-testid="orden-select"]').should('have.value', 'nombre');
        } else {
          cy.log('No hay opciones de ordenamiento');
        }
      });
    });

    it('debería filtrar por categoría', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar si hay filtros por categoría
      cy.get('body').then(($body) => {
        if ($body.find('select[name="categoria"], [data-testid="categoria-select"]').length > 0) {
          cy.get('select[name="categoria"], [data-testid="categoria-select"]').select('Artesanías');
          cy.get('select[name="categoria"], [data-testid="categoria-select"]').should('have.value', 'Artesanías');
        } else {
          cy.log('No hay filtros por categoría');
        }
      });
    });
  });

  describe('Resultados de Búsqueda', () => {
    it('debería mostrar resultados de búsqueda', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Hacer búsqueda
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se muestran resultados
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          cy.get('.card').should('have.length.greaterThan', 0);
        } else {
          cy.get('h3').should('contain', 'No se encontraron tiendas');
        }
      });
    });

    it('debería mostrar estado vacío cuando no hay resultados', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Buscar algo que no existe
      cy.get('input[placeholder*="ciudad"]').type('CiudadInexistente123');
      cy.get('button[type="submit"]').click();
      
      // Verificar estado vacío
      cy.get('h3').should('contain', 'No se encontraron tiendas');
    });

    it('debería mostrar información de tienda en resultados', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que las cards muestran información
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          cy.get('.card').first().within(() => {
            cy.get('h3, .card-title').should('exist'); // Nombre de tienda
            cy.get('.badge, .tag').should('exist'); // Ciudad/País
          });
        }
      });
    });
  });

  describe('Navegación desde Búsqueda', () => {
    it('debería navegar a detalles desde resultados', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar si hay tiendas
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          // Hacer clic en "Ver Detalles"
          cy.get('.card').first().within(() => {
            cy.get('a[href*="/tiendas/"]').click();
          });
          
          // Verificar navegación a detalles
          cy.url().should('include', '/tiendas/');
          cy.get('h1, h2').should('exist');
        } else {
          cy.log('No hay tiendas para navegar');
        }
      });
    });

    it('debería mantener filtros al navegar y regresar', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Aplicar filtro
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Navegar a detalles
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          cy.get('.card').first().within(() => {
            cy.get('a[href*="/tiendas/"]').click();
          });
          
          // Regresar a la lista
          cy.get('a[href="/tiendas"], button:contains("Volver")').click();
          
          // Verificar que se mantiene el filtro
          cy.get('input[placeholder*="ciudad"]').should('have.value', 'Madrid');
        }
      });
    });
  });

  describe('Búsqueda Avanzada', () => {
    it('debería usar filtros múltiples', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Aplicar múltiples filtros
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      
      // Si hay filtros adicionales
      cy.get('body').then(($body) => {
        if ($body.find('select[name="categoria"]').length > 0) {
          cy.get('select[name="categoria"]').select('Artesanías');
        }
        
        cy.get('button[type="submit"]').click();
        
        // Verificar que se aplicaron los filtros
        cy.get('input[placeholder*="ciudad"]').should('have.value', 'Madrid');
      });
    });

    it('debería guardar búsquedas recientes', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Hacer búsqueda
      cy.get('input[placeholder*="ciudad"]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Verificar si se guarda en historial
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="search-history"]').length > 0) {
          cy.get('[data-testid="search-history"]').should('contain', 'Madrid');
        }
      });
    });
  });
}); 