describe('Productos E2E Tests', () => {
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

  describe('Lista de Productos', () => {
    it('debería mostrar la página de productos con elementos básicos', () => {
      cy.visit('/productos');
      // Esperar a que desaparezca el mensaje de verificación de autenticación
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('h1').should('contain', 'Productos');
      cy.get('button').should('contain', 'Agregar Producto');
      cy.get('input[placeholder="Buscar productos..."]').should('be.visible');
    });

    it('debería mostrar estado vacío cuando no hay productos', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Como el backend está vacío, debería mostrar el estado vacío
      cy.contains('No se encontraron productos').should('be.visible');
      cy.contains('Sé el primero en agregar un producto').should('be.visible');
      cy.get('button').contains('Agregar Producto').should('be.visible');
    });

    it('debería navegar a la página de crear producto', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Agregar Producto').click();
      cy.url().should('include', '/productos/create');
      cy.get('h1').should('contain', 'Agregar Producto');
    });

    it('debería mostrar el botón de volver en la página de crear', () => {
      cy.visit('/productos/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Volver').should('be.visible');
      cy.get('h1').should('contain', 'Agregar Producto');
    });
  });

  describe('Creación de Productos', () => {
    beforeEach(() => {
      cy.visit('/productos/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    it('debería mostrar el formulario de creación con todos los campos', () => {
      cy.get('form').should('be.visible');
      cy.get('label').contains('Tienda *').should('be.visible');
      cy.get('label').contains('Nombre del producto *').should('be.visible');
      cy.get('label').contains('Precio *').should('be.visible');
      cy.get('label').contains('Categoría *').should('be.visible');
      cy.get('label').contains('Descripción *').should('be.visible');
      cy.get('label').contains('Imagen del producto (URL)').should('be.visible');
    });

    // it('debería mostrar validaciones de campos requeridos', () => {
    //   cy.get('button[type="submit"]').click();
    //   
    //   // Verificar mensajes de error
    //   cy.contains('Selecciona una tienda').should('be.visible');
    //   cy.contains('El nombre debe tener al menos 2 caracteres').should('be.visible');
    //   cy.contains('El precio debe ser mayor a 0').should('be.visible');
    //   cy.contains('Selecciona una categoría').should('be.visible');
    //   cy.contains('La descripción debe tener al menos 10 caracteres').should('be.visible');
    // });

    it('debería permitir llenar el formulario correctamente', () => {
      // Llenar nombre
      cy.get('input[name="nombre"]').type('Producto de prueba');

      // Llenar precio
      cy.get('input[name="precio"]').type('100');

      // Llenar descripción
      cy.get('textarea[name="descripcion"]').type('Esta es una descripción de prueba para el producto');

      // Llenar imagen (opcional)
      cy.get('input[name="imagen"]').type('https://ejemplo.com/imagen.jpg');

      // Verificar que no hay errores
      cy.contains('El nombre debe tener al menos 2 caracteres').should('not.exist');
      cy.contains('El precio debe ser mayor a 0').should('not.exist');
      cy.contains('La descripción debe tener al menos 10 caracteres').should('not.exist');
    });

    it('debería mostrar alerta si el usuario no tiene tiendas', () => {
      // Si no hay tiendas, debería mostrar la alerta
      cy.contains('Necesitas crear una tienda antes de agregar productos').should('be.visible');
      cy.contains('Crear tienda').should('be.visible');
    });

    it('debería navegar de vuelta a la lista de productos', () => {
      cy.get('button').contains('Volver').click();
      cy.url().should('include', '/productos');
      cy.get('h1').should('contain', 'Productos');
    });

    it('debería cancelar la creación y volver a la lista', () => {
      cy.get('button').contains('Cancelar').click();
      cy.url().should('include', '/productos');
      cy.get('h1').should('contain', 'Productos');
    });
  });

  describe('Búsqueda y Filtros', () => {
    beforeEach(() => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    it('debería permitir buscar productos', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('test');
      // Como no hay productos, debería mostrar el estado vacío con mensaje de búsqueda
      cy.contains('Intenta con otros términos de búsqueda o filtros').should('be.visible');
    });

    // it('debería permitir filtrar por categoría', () => {
    //   cy.get('select').first().select('Artesanías');
    //   // Verificar que se aplicó el filtro
    //   cy.get('select').first().should('have.value', 'Artesanías');
    // });

    // it('debería mostrar todas las categorías en el filtro', () => {
    //   cy.get('select').first().find('option').should('have.length.at.least', 9);
    //   cy.get('select').first().find('option').should('contain', 'Artesanías');
    //   cy.get('select').first().find('option').should('contain', 'Textiles');
    //   cy.get('select').first().find('option').should('contain', 'Cerámica');
    // });

    it('debería limpiar la búsqueda', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('test');
      cy.get('input[placeholder="Buscar productos..."]').clear();
      // Debería volver al estado original
      cy.contains('Sé el primero en agregar un producto').should('be.visible');
    });
  });

  describe('Navegación y Accesibilidad', () => {
    it('debería navegar usando el botón de volver', () => {
      cy.visit('/productos/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Volver').click();
      cy.url().should('include', '/productos');
    });

    it('debería mostrar breadcrumbs o navegación clara', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Agregar Producto').should('be.visible');
      cy.get('input[placeholder="Buscar productos..."]').should('be.visible');
    });

    it('debería tener títulos de página apropiados', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('h1').should('contain', 'Productos');
      cy.get('p').should('contain', 'Explora nuestro catálogo de productos artesanales');
    });

    it('debería mostrar botones con iconos apropiados', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Agregar Producto').should('be.visible');
      // Verificar que el botón tiene el icono Plus
      cy.get('button').contains('Agregar Producto').find('svg').should('exist');
    });
  });

  describe('Estados de Carga y Error', () => {
    it('debería mostrar estado de carga inicial', () => {
      // El estado de carga se maneja automáticamente por el componente
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    // it('debería manejar errores de red apropiadamente', () => {
    //   // Simular error de red interceptando la petición
    //   cy.intercept('GET', '**/productos**', { statusCode: 500 }).as('getProductos');
    //   cy.visit('/productos');
    //   cy.wait('@getProductos');
    //   // Debería mostrar un mensaje de error
    //   cy.contains('Error').should('be.visible');
    // });

    // it('debería permitir reintentar después de un error', () => {
    //   cy.intercept('GET', '**/productos**', { statusCode: 500 }).as('getProductosError');
    //   cy.visit('/productos');
    //   cy.wait('@getProductosError');
    //   cy.get('button').contains('Reintentar').click();
    //   // Debería hacer una nueva petición
    //   cy.wait('@getProductosError');
    // });
  });

  describe('Responsive Design', () => {
    it('debería ser responsive en diferentes tamaños de pantalla', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Vista móvil
      cy.viewport(375, 667);
      cy.get('h1').should('be.visible');
      cy.get('button').contains('Agregar Producto').should('be.visible');

      // Vista tablet
      cy.viewport(768, 1024);
      cy.get('h1').should('be.visible');
      cy.get('button').contains('Agregar Producto').should('be.visible');

      // Vista desktop
      cy.viewport(1920, 1080);
      cy.get('h1').should('be.visible');
      cy.get('button').contains('Agregar Producto').should('be.visible');
    });

    it('debería mostrar el grid de productos apropiadamente', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      // Verificar que el grid está presente (aunque esté vacío)
      cy.get('.grid').should('exist');
    });
  });

  describe('Interacciones de Usuario', () => {
    it('debería permitir hacer clic en botones sin errores', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('button').contains('Agregar Producto').click();
      cy.url().should('include', '/productos/create');
    });

    it('debería permitir escribir en campos de búsqueda', () => {
      cy.visit('/productos');
      cy.contains('Verificando autenticacion...').should('not.exist');
      
      cy.get('input[placeholder="Buscar productos..."]').type('test');
      cy.get('input[placeholder="Buscar productos..."]').should('have.value', 'test');
    });

    // it('debería permitir seleccionar opciones del filtro', () => {
    //   cy.visit('/productos');
    //   cy.contains('Verificando autenticacion...').should('not.exist');
    //   
    //   cy.get('select').first().select('Artesanías');
    //   // Verificar que se seleccionó una opción
    //   cy.get('select').first().should('have.value', 'Artesanías');
    // });
  });

  describe('Validaciones de Formulario', () => {
    beforeEach(() => {
      cy.visit('/productos/create');
      cy.contains('Verificando autenticacion...').should('not.exist');
    });

    it('debería validar longitud mínima del nombre', () => {
      cy.get('input[name="nombre"]').type('a');
      cy.get('button[type="submit"]').click();
      cy.contains('El nombre debe tener al menos 2 caracteres').should('be.visible');
    });

    it('debería validar precio positivo', () => {
      cy.get('input[name="precio"]').type('-10');
      cy.get('button[type="submit"]').click();
      cy.contains('El precio debe ser mayor a 0').should('be.visible');
    });

    it('debería validar longitud mínima de descripción', () => {
      cy.get('textarea[name="descripcion"]').type('corta');
      cy.get('button[type="submit"]').click();
      cy.contains('La descripción debe tener al menos 10 caracteres').should('be.visible');
    });

    it('debería validar URL de imagen si se proporciona', () => {
      cy.get('input[name="imagen"]').type('invalid-url');
      cy.get('button[type="submit"]').click();
      cy.contains('La imagen debe ser una URL válida').should('be.visible');
    });

    it('debería aceptar URL válida de imagen', () => {
      cy.get('input[name="imagen"]').type('https://ejemplo.com/imagen.jpg');
      cy.get('button[type="submit"]').click();
      cy.contains('La imagen debe ser una URL válida').should('not.exist');
    });
  });
}); 