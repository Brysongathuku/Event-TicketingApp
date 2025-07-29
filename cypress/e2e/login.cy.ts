// describe("Login Form Tests", () => {
//   beforeEach(() => {
//     cy.visit("/login");
//   });

//   it("should login with valid user credentials", () => {
//     cy.contains(/Welcome Back/i).should("be.visible");
//     cy.contains(/Sign in to your account/i).should("be.visible");

//     cy.getDataTest("login-email-input")
//       .should("be.visible")
//       .should("have.attr", "type", "email")
//       .clear()
//       .type("naamanomare99@gmail.com");

//     cy.getDataTest("login-password-input")
//       .should("be.visible")
//       .should("have.attr", "type", "password")
//       .clear()
//       .type("pass123");

//     cy.getDataTest("login-submit-button")
//       .should("contain.text", "Sign In")
//       .should("not.be.disabled")
//       .click();

//     // Check for either success message or redirect
//     cy.url().should("include", "/user/dashboard/");
//   });

//   it("should login with valid admin credentials", () => {
//     cy.contains(/Welcome Back/i).should("be.visible");

//     cy.getDataTest("login-email-input")
//       .should("be.visible")
//       .should("have.attr", "type", "email")
//       .clear()
//       .type("suzzannekans@gmail.com");

//     cy.getDataTest("login-password-input")
//       .should("be.visible")
//       .should("have.attr", "type", "password")
//       .clear()
//       .type("pass123");

//     cy.getDataTest("login-submit-button")
//       .should("contain.text", "Sign In")
//       .should("not.be.disabled")
//       .click();

//     cy.url().should("include", "/admin/dashboard/");
//   });

//   it("should not login with invalid credentials", () => {
//     cy.contains(/Welcome Back/i).should("be.visible");

//     cy.getDataTest("login-email-input").clear().type("invalid@gmail.com");

//     cy.getDataTest("login-password-input").clear().type("wrongpassword123");

//     cy.getDataTest("login-submit-button")
//       .should("contain.text", "Sign In")
//       .click();

//     // Check that we stay on login page (authentication failed)
//     cy.url().should("include", "/login");
//   });

//   it("should show validation error for empty email", () => {
//     cy.getDataTest("login-password-input").clear().type("pass123");

//     cy.getDataTest("login-submit-button").click();

//     // Check for validation error or that form wasn't submitted
//     cy.url().should("include", "/login");
//   });

//   it("should show validation error for invalid email format", () => {
//     cy.getDataTest("login-email-input").clear().type("invalidemail");

//     cy.getDataTest("login-password-input").clear().type("pass123");

//     cy.getDataTest("login-submit-button").click();

//     // Check that form wasn't submitted due to invalid email
//     cy.url().should("include", "/login");
//   });

//   it("should show validation error for empty password", () => {
//     cy.getDataTest("login-email-input").clear().type("test@gmail.com");

//     cy.getDataTest("login-submit-button").click();

//     // Check that form wasn't submitted
//     cy.url().should("include", "/login");
//   });

//   it("should show validation error for password less than 6 characters", () => {
//     cy.getDataTest("login-email-input")
//       .should("be.visible")
//       .clear()
//       .type("test@gmail.com");

//     cy.getDataTest("login-password-input").clear().type("123");

//     cy.getDataTest("login-submit-button").click();

//     // Check that form wasn't submitted
//     cy.url().should("include", "/login");
//   });

//   it("should navigate to register page when clicking sign up link", () => {
//     cy.contains(/Sign up/i).click();
//     cy.url().should("include", "/register");
//   });

//   it("should display all form elements correctly", () => {
//     cy.contains(/Welcome Back/i).should("be.visible");
//     cy.contains(/Sign in to your account/i).should("be.visible");

//     cy.getDataTest("login-email-input")
//       .should("be.visible")
//       .should("have.attr", "type", "email");

//     cy.getDataTest("login-password-input")
//       .should("be.visible")
//       .should("have.attr", "type", "password");

//     cy.getDataTest("login-submit-button")
//       .should("be.visible")
//       .should("contain.text", "Sign In");

//     // Check optional elements if they exist
//     cy.get("body").then(($body) => {
//       if ($body.find("#remember-me").length > 0) {
//         cy.get("#remember-me").should("be.visible");
//       }
//     });

//     cy.contains(/Sign up/i).should("be.visible");
//   });
// });
