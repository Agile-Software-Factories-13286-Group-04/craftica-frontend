/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="correo"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// -- This is a child command --
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// -- This is a dual command --
Cypress.Commands.add('mockAuthenticatedUser', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('craftica_token', 'mock-token');
    win.localStorage.setItem('craftica_user', JSON.stringify({
      id: '1',
      nombre: 'Test User',
      correo: 'test@test.com'
    }));
  });
});

Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage();
});

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

export {};