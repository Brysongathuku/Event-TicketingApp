// /// <reference types="cypress" />

// // Custom command to get elements by data-test attribute
// Cypress.Commands.add("getDataTest", (dataTestSelector) => {
//   return cy.get(`[data-test="${dataTestSelector}"]`);
// });

// // Login Admin user
// Cypress.Commands.add(
//   "loginAsAdmin",
//   (email = "s@gmail.com", password = "pass123") => {
//     cy.visit("/login");
//     cy.getDataTest("login-email-input").type(email);
//     cy.getDataTest("login-password-input").type(password);
//     cy.getDataTest("login-submit-button").click();

//     // Wait for successful login toast
//     cy.contains(/Login successful/i).should("be.visible");

//     // Assert redirect to admin dashboard
//     cy.url().should("include", "/admin/dashboard/").as("adminDashboardUrl");

//     // Verify admin dashboard content
//     cy.get("body").should("contain.text", "Welcome to your Admin dashboard");
//   }
// );

// // Login Normal User
// Cypress.Commands.add(
//   "loginAsUser",
//   (email = "naamanomare99@gmail.com", password = "pass123") => {
//     cy.visit("/login");
//     cy.getDataTest("login-email-input").type(email);
//     cy.getDataTest("login-password-input").type(password);
//     cy.getDataTest("login-submit-button").click();

//     // Wait for successful login toast
//     cy.contains(/Login successful/i).should("be.visible");

//     // Assert redirect to user dashboard
//     cy.url().should("include", "/user/dashboard/").as("userDashboardUrl");

//     // Verify user dashboard content
//     cy.get("body").should("contain.text", "Welcome to your User dashboard");
//   }
// );
