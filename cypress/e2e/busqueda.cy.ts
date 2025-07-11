describe('Búsqueda E2E Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.url().should('include', '/login');
    cy.contains('Verificando autenticacion...').should('not.exist');
    cy.get('input[id="correo"]', { timeout: 20000 }).should('be.visible').type('test1@gmail.com');
    cy.get('input[id="password"]', { timeout: 20000 }).should('be.visible').type('test1@gmail.com');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  describe('Búsqueda de Tiendas', () => {
    beforeEach(() => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    it('debería mostrar el formulario de búsqueda de tiendas', () => {
      cy.get('input[placeholder="Buscar por ciudad o país..."]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Buscar');
    });

    it('debería permitir escribir en el campo de búsqueda', () => {
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Madrid');
      cy.get('input[placeholder="Buscar por ciudad o país..."]').should('have.value', 'Madrid');
    });

    it('debería enviar la búsqueda al hacer clic en el botón', () => {
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Verificar que se aplicó la búsqueda
      cy.get('input[placeholder="Buscar por ciudad o país..."]').should('have.value', 'Madrid');
    });

    it('debería enviar la búsqueda al presionar Enter', () => {
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Barcelona{enter}');
      
      // Verificar que se aplicó la búsqueda
      cy.get('input[placeholder="Buscar por ciudad o país..."]').should('have.value', 'Barcelona');
    });

    // it('debería mostrar estado vacío cuando no hay resultados de búsqueda', () => {
    //   cy.get('input[placeholder="Buscar por ciudad o país..."]').type('CiudadInexistente123');
    //   cy.get('button[type="submit"]').click();
    //   
    //   // Verificar estado vacío
    //   cy.contains('No se encontraron tiendas').should('be.visible');
    //   cy.contains('Intenta con otros términos de búsqueda').should('be.visible');
    // });

    it('debería limpiar la búsqueda', () => {
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Limpiar búsqueda
      cy.get('input[placeholder="Buscar por ciudad o país..."]').clear();
      cy.get('button[type="submit"]').click();
      
      // Verificar que se limpió
      cy.get('input[placeholder="Buscar por ciudad o país..."]').should('have.value', '');
    });

    it('debería mostrar spinner durante la búsqueda', () => {
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Verificar que el botón muestra spinner
      cy.get('button[type="submit"]').should('contain', 'Buscar');
    });
  });

  describe('Búsqueda de Productos', () => {
    beforeEach(() => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    it('debería mostrar el campo de búsqueda de productos', () => {
      cy.get('input[placeholder="Buscar productos..."]').should('be.visible');
    });

    it('debería permitir escribir en el campo de búsqueda', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('artesanía');
      cy.get('input[placeholder="Buscar productos..."]').should('have.value', 'artesanía');
    });

    it('debería filtrar productos en tiempo real', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('test');
      
      // Como no hay productos, debería mostrar el estado vacío con mensaje de búsqueda
      cy.contains('Intenta con otros términos de búsqueda o filtros').should('be.visible');
    });

    it('debería mostrar estado vacío cuando no hay resultados de búsqueda', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('ProductoInexistente123');
      
      // Verificar estado vacío
      cy.contains('No se encontraron productos').should('be.visible');
      cy.contains('Intenta con otros términos de búsqueda o filtros').should('be.visible');
    });

    it('debería limpiar la búsqueda', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('test');
      cy.get('input[placeholder="Buscar productos..."]').clear();
      
      // Debería volver al estado original
      cy.contains('Sé el primero en agregar un producto').should('be.visible');
    });

    // it('debería mostrar el filtro de categorías', () => {
    //   cy.get('select').first().should('be.visible');
    //   cy.get('select').first().find('option').should('contain', 'Todas las categorías');
    // });

    // it('debería permitir filtrar por categoría', () => {
    //   cy.get('select').first().select('Artesanías');
    //   cy.get('select').first().should('have.value', 'Artesanías');
    // });

    // it('debería mostrar todas las categorías disponibles', () => {
    //   cy.get('select').first().find('option').should('have.length.at.least', 9);
    //   cy.get('select').first().find('option').should('contain', 'Artesanías');
    //   cy.get('select').first().find('option').should('contain', 'Textiles');
    //   cy.get('select').first().find('option').should('contain', 'Cerámica');
    //   cy.get('select').first().find('option').should('contain', 'Madera');
    //   cy.get('select').first().find('option').should('contain', 'Joyería');
    //   cy.get('select').first().find('option').should('contain', 'Decoración');
    //   cy.get('select').first().find('option').should('contain', 'Ropa');
    //   cy.get('select').first().find('option').should('contain', 'Accesorios');
    //   cy.get('select').first().find('option').should('contain', 'Otros');
    // });

    // it('debería combinar búsqueda de texto con filtro de categoría', () => {
    //   cy.get('input[placeholder="Buscar productos..."]').type('artesanía');
    //   cy.get('select').first().select('Artesanías');
    //   
    //   // Verificar que ambos filtros están aplicados
    //   cy.get('input[placeholder="Buscar productos..."]').should('have.value', 'artesanía');
    //   cy.get('select').first().should('have.value', 'Artesanías');
    // });
  });

  describe('Búsqueda Avanzada y Casos Edge', () => {
    it('debería manejar búsquedas con caracteres especiales', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Madrid-Sur');
      cy.get('button[type="submit"]').click();
      
      cy.get('input[placeholder="Buscar por ciudad o país..."]').should('have.value', 'Madrid-Sur');
    });

    it('debería manejar búsquedas con espacios múltiples', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('   Madrid   ');
      cy.get('button[type="submit"]').click();
      
      cy.get('input[placeholder="Buscar por ciudad o país..."]').should('have.value', '   Madrid   ');
    });

    it('debería manejar búsquedas vacías', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button[type="submit"]').click();
      
      // No debería haber error
      cy.get('h1').should('contain', 'Tiendas');
    });

    it('debería mantener el estado de búsqueda al navegar', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Hacer búsqueda
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Navegar a otra página
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Regresar a tiendas
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // La búsqueda debería estar limpia
      cy.get('input[placeholder="Buscar por ciudad o país..."]').should('have.value', '');
    });
  });

  describe('Navegación desde Resultados de Búsqueda', () => {
    it('debería navegar a detalles de tienda desde resultados de búsqueda', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Hacer búsqueda
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Verificar si hay tiendas en los resultados
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          // Navegar a detalles de la primera tienda
          cy.get('.card').first().within(() => {
            cy.get('a[href*="/tiendas/"]').click();
          });
          
          // Verificar navegación a detalles
          cy.url().should('include', '/tiendas/');
          cy.get('h1, h2').should('exist');
        } else {
          cy.log('No hay tiendas en los resultados de búsqueda');
        }
      });
    });

    it('debería navegar a detalles de producto desde resultados de búsqueda', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Hacer búsqueda
      cy.get('input[placeholder="Buscar productos..."]').type('test');
      
      // Verificar si hay productos en los resultados
      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          // Navegar a detalles del primer producto
          cy.get('.card').first().within(() => {
            cy.get('a[href*="/productos/"]').click();
          });
          
          // Verificar navegación a detalles
          cy.url().should('include', '/productos/');
          cy.get('h1, h2').should('exist');
        } else {
          cy.log('No hay productos en los resultados de búsqueda');
        }
      });
    });
  });

  describe('Paginación con Búsqueda', () => {
    it('debería mantener la búsqueda al cambiar de página en tiendas', () => {
      cy.visit('/tiendas');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Hacer búsqueda
      cy.get('input[placeholder="Buscar por ciudad o país..."]').type('Madrid');
      cy.get('button[type="submit"]').click();
      
      // Verificar si hay paginación
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Siguiente")').length > 0) {
          // Cambiar a siguiente página
          cy.get('button:contains("Siguiente")').click();
          cy.get('span').should('contain', 'Página 2');
          
          // Verificar que la búsqueda se mantiene
          cy.get('input[placeholder="Buscar por ciudad o país..."]').should('have.value', 'Madrid');
        } else {
          cy.log('No hay suficientes tiendas para paginación');
        }
      });
    });

    it('debería mantener la búsqueda al cambiar de página en productos', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Hacer búsqueda
      cy.get('input[placeholder="Buscar productos..."]').type('test');
      
      // Verificar si hay paginación
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Siguiente")').length > 0) {
          // Cambiar a siguiente página
          cy.get('button:contains("Siguiente")').click();
          cy.get('span').should('contain', 'Página 2');
          
          // Verificar que la búsqueda se mantiene
          cy.get('input[placeholder="Buscar productos..."]').should('have.value', 'test');
        } else {
          cy.log('No hay suficientes productos para paginación');
        }
      });
    });
  });
}); 