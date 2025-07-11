describe('Publicaciones E2E Tests', () => {
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

  describe('Lista de Publicaciones', () => {
    // it('debería mostrar la página de publicaciones con elementos básicos', () => {
    //   cy.visit('/publicaciones');
    //   cy.contains('Verificando autenticacion...').should('not.exist');
    //   
    //   cy.get('h1').should('contain', 'Publicaciones');
    //   cy.get('button').should('contain', 'Crear Publicación');
    //   cy.get('input[placeholder="Buscar publicaciones..."]').should('be.visible');
    // });

    // it('debería mostrar estado vacío cuando no hay publicaciones', () => {
    //   cy.visit('/publicaciones');
    //   cy.contains('Verificando autenticacion...').should('not.exist');
    //   
    //   // Como el backend está vacío, debería mostrar el estado vacío
    //   cy.contains('No se encontraron publicaciones').should('be.visible');
    //   cy.contains('Sé el primero en crear una publicación').should('be.visible');
    //   cy.get('button').contains('Crear Publicación').should('be.visible');
    // });

    it('debería navegar a la página de crear publicación', () => {
      cy.visit('/publicaciones');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Crear Publicación').click();
      cy.url().should('include', '/publicaciones/create');
      cy.get('h1').should('contain', 'Crear Publicación');
    });

    it('debería mostrar el botón de volver en la página de crear', () => {
      cy.visit('/publicaciones/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Volver').should('be.visible');
      cy.get('h1').should('contain', 'Crear Publicación');
    });
  });

  describe('Creación de Publicaciones', () => {
    beforeEach(() => {
      cy.visit('/publicaciones/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    it('debería mostrar el formulario de creación con todos los campos', () => {
      cy.get('form').should('be.visible');
      cy.get('label').contains('Título *').should('be.visible');
      cy.get('label').contains('Contenido *').should('be.visible');
      // cy.get('label').contains('Imagen (URL)').should('be.visible');
    });

    // it('debería permitir llenar el formulario correctamente', () => {
    //   // Llenar título
    //   cy.get('input[name="titulo"]').type('Publicación de prueba');

    //   // Llenar contenido
    //   cy.get('textarea[name="contenido"]').type('Esta es una publicación de prueba para verificar el funcionamiento del sistema');

    //   // Llenar imagen (opcional)
    //   cy.get('input[name="imagen"]').type('https://ejemplo.com/imagen.jpg');

    //   // Verificar que no hay errores
    //   cy.contains('El título debe tener al menos 3 caracteres').should('not.exist');
    //   cy.contains('El contenido debe tener al menos 10 caracteres').should('not.exist');
    // });

    it('debería navegar de vuelta a la lista de publicaciones', () => {
      cy.get('button').contains('Volver').click();
      cy.url().should('include', '/publicaciones');
      cy.get('h1').should('contain', 'Publicaciones');
    });

    it('debería cancelar la creación y volver a la lista', () => {
      cy.get('button').contains('Cancelar').click();
      cy.url().should('include', '/publicaciones');
      cy.get('h1').should('contain', 'Publicaciones');
    });
  });

  describe('Búsqueda y Filtros', () => {
    beforeEach(() => {
      cy.visit('/publicaciones');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    // it('debería permitir buscar publicaciones', () => {
    //   cy.get('input[placeholder="Buscar publicaciones..."]').type('test');
    //   // Como no hay publicaciones, debería mostrar el estado vacío con mensaje de búsqueda
    //   cy.contains('Intenta con otros términos de búsqueda').should('be.visible');
    // });

    // it('debería limpiar la búsqueda', () => {
    //   cy.get('input[placeholder="Buscar publicaciones..."]').type('test');
    //   cy.get('input[placeholder="Buscar publicaciones..."]').clear();
    //   // Debería volver al estado original
    //   cy.contains('Sé el primero en crear una publicación').should('be.visible');
    // });
  });

  describe('Navegación y Accesibilidad', () => {
    it('debería navegar usando el botón de volver', () => {
      cy.visit('/publicaciones/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Volver').click();
      cy.url().should('include', '/publicaciones');
    });

    // it('debería mostrar breadcrumbs o navegación clara', () => {
    //   cy.visit('/publicaciones');
    //   cy.contains('Verificando autenticacion...').should('not.exist');
    //   
    //   cy.get('button').contains('Crear Publicación').should('be.visible');
    //   cy.get('input[placeholder="Buscar publicaciones..."]').should('be.visible');
    // });

    // it('debería tener títulos de página apropiados', () => {
    //   cy.visit('/publicaciones');
    //   cy.contains('Verificando autenticacion...').should('not.exist');
    //   
    //   cy.get('h1').should('contain', 'Publicaciones');
    //   cy.get('p').should('contain', 'Comparte tus ideas y experiencias');
    // });

    it('debería mostrar botones con iconos apropiados', () => {
      cy.visit('/publicaciones');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Crear Publicación').should('be.visible');
      // Verificar que el botón tiene el icono Plus
      cy.get('button').contains('Crear Publicación').find('svg').should('exist');
    });
  });

  describe('Estados de Carga y Error', () => {
    it('debería mostrar estado de carga inicial', () => {
      // El estado de carga se maneja automáticamente por el componente
      cy.visit('/publicaciones');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });
  });

  describe('Responsive Design', () => {
    it('debería ser responsive en diferentes tamaños de pantalla', () => {
      cy.visit('/publicaciones');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Vista móvil
      cy.viewport(375, 667);
      cy.get('h1').should('be.visible');
      cy.get('button').contains('Crear Publicación').should('be.visible');

      // Vista tablet
      cy.viewport(768, 1024);
      cy.get('h1').should('be.visible');
      cy.get('button').contains('Crear Publicación').should('be.visible');

      // Vista desktop
      cy.viewport(1920, 1080);
      cy.get('h1').should('be.visible');
      cy.get('button').contains('Crear Publicación').should('be.visible');
    });

    it('debería mostrar el grid de publicaciones apropiadamente', () => {
      cy.visit('/publicaciones');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que el grid está presente (aunque esté vacío)
      cy.get('.grid').should('exist');
    });
  });

  describe('Interacciones de Usuario', () => {
    it('debería permitir hacer clic en botones sin errores', () => {
      cy.visit('/publicaciones');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Crear Publicación').click();
      cy.url().should('include', '/publicaciones/create');
    });

    // it('debería permitir escribir en campos de búsqueda', () => {
    //   cy.visit('/publicaciones');
    //   cy.contains('Verificando autenticacion...').should('not.exist');
    //   
    //   cy.get('input[placeholder="Buscar publicaciones..."]').type('test');
    //   cy.get('input[placeholder="Buscar publicaciones..."]').should('have.value', 'test');
    // });
  });

  describe('Validaciones de Formulario', () => {
    beforeEach(() => {
      cy.visit('/publicaciones/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    // it('debería validar longitud mínima del título', () => {
    //   cy.get('input[name="titulo"]').type('ab');
    //   cy.get('button[type="submit"]').click();
    //   cy.contains('El título debe tener al menos 3 caracteres').should('be.visible');
    // });

    // it('debería validar longitud mínima del contenido', () => {
    //   cy.get('textarea[name="contenido"]').type('corto');
    //   cy.get('button[type="submit"]').click();
    //   cy.contains('El contenido debe tener al menos 10 caracteres').should('be.visible');
    // });

    // it('debería validar URL de imagen si se proporciona', () => {
    //   cy.get('input[name="imagen"]').type('invalid-url');
    //   cy.get('button[type="submit"]').click();
    //   cy.contains('La imagen debe ser una URL válida').should('be.visible');
    // });

    // it('debería aceptar URL válida de imagen', () => {
    //   cy.get('input[name="imagen"]').type('https://ejemplo.com/imagen.jpg');
    //   cy.get('button[type="submit"]').click();
    //   cy.contains('La imagen debe ser una URL válida').should('not.exist');
    // });
  });
}); 