/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-test attribute.
     * @example cy.getDataTest('login-email-input')
     */
    getDataTest(value: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to login as admin user.
     * @example cy.loginAsAdmin()
     * @example cy.loginAsAdmin('admin@example.com', 'password123')
     */
    loginAsAdmin(email?: string, password?: string): Chainable<void>;

    /**
     * Custom command to login as normal user.
     * @example cy.loginAsUser()
     * @example cy.loginAsUser('user@example.com', 'password123')
     */
    loginAsUser(email?: string, password?: string): Chainable<void>;
  }
}
