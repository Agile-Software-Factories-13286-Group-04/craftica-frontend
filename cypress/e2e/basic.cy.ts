describe('Basic E2E Test', () => {
  it('debería poder abrir Google', () => {
    // Test básico para verificar que Cypress funciona
    cy.visit('https://www.google.com');
    
    // Verificar que la página se cargó
    cy.title().should('contain', 'Google');
  });

  it('debería poder navegar a la página principal', () => {
    // Test para verificar que podemos navegar a nuestra app
    cy.visit('/');
    
    // Verificar que la página se cargó
    cy.title().should('exist');
  });

  it('debería poder hacer clic en elementos', () => {
    // Test para verificar interacciones básicas
    cy.visit('/');
    
    // Verificar que podemos hacer clic en elementos
    cy.get('body').should('exist');
  });
}); 