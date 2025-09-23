describe("Login Form Tests", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display login form elements correctly", () => {
    cy.contains("Welcome Back").should("be.visible");
    cy.get('[data-test="login-email-input"]')
      .should("be.visible")
      .should("have.attr", "type", "email");
    cy.get('[data-test="login-password-input"]')
      .should("be.visible")
      .should("have.attr", "type", "password");
    cy.get('[data-test="login-submit-button"]')
      .should("be.visible")
      .should("contain.text", "Sign In");
  });

  it("should login with valid user credentials", () => {
    // Mock the login API call for user
    cy.intercept("POST", "**/login", {
      statusCode: 200,
      body: {
        token: "mock-user-token",
        user: {
          id: 1,
          email: "gathukubryson@gmail.com",
          role: "user",
          name: "Bryson Gathuku",
        },
      },
    }).as("loginUser");

    cy.get('[data-test="login-email-input"]')
      .clear()
      .type("gathukubryson@gmail.com");

    cy.get('[data-test="login-password-input"]').clear().type("bryson");

    cy.get('[data-test="login-submit-button"]').click();

    // Wait for the API call and verify navigation
    cy.wait("@loginUser");
    cy.url().should("include", "/user/dashboard/");
  });

  it("should login with valid admin credentials", () => {
    // Mock the login API call for admin
    cy.intercept("POST", "**/login", {
      statusCode: 200,
      body: {
        token: "mock-admin-token",
        user: {
          id: 2,
          email: "brysongathuku189@gmail.com",
          role: "admin",
          name: "Admin User",
        },
      },
    }).as("loginAdmin");

    cy.get('[data-test="login-email-input"]')
      .clear()
      .type("brysongathuku189@gmail.com");

    cy.get('[data-test="login-password-input"]').clear().type("bryson");

    cy.get('[data-test="login-submit-button"]').click();

    // Wait for the API call and verify navigation
    cy.wait("@loginAdmin");
    cy.url().should("include", "/admin/dashboard/");
  });

  it("should reject invalid credentials", () => {
    // Mock failed login API call
    cy.intercept("POST", "**/login", {
      statusCode: 401,
      body: {
        message: "Invalid credentials",
      },
    }).as("loginFailed");

    cy.get('[data-test="login-email-input"]').clear().type("invalid@gmail.com");

    cy.get('[data-test="login-password-input"]').clear().type("wrongpassword");

    cy.get('[data-test="login-submit-button"]').click();

    // Wait for the API call and verify user stays on login page
    cy.wait("@loginFailed");
    cy.url().should("include", "/login");

    // Optionally check for error toast/message
    // cy.contains("Login failed").should("be.visible");
  });

  it("should validate empty email field", () => {
    cy.get('[data-test="login-password-input"]').clear().type("pass123");

    cy.get('[data-test="login-submit-button"]').click();

    cy.url().should("include", "/login");
    cy.contains("Email is required").should("be.visible");
  });

  it("should stay on login page with invalid email format", () => {
    cy.get('[data-test="login-email-input"]').clear().type("invalidemail");

    cy.get('[data-test="login-password-input"]').clear().type("pass123");

    cy.get('[data-test="login-submit-button"]').click();

    // Just verify it stays on login page (form doesn't submit with invalid data)
    cy.url().should("include", "/login");
  });

  it("should stay on login page with short password", () => {
    cy.get('[data-test="login-email-input"]').clear().type("test@gmail.com");

    cy.get('[data-test="login-password-input"]').clear().type("123");

    cy.get('[data-test="login-submit-button"]').click();

    // Just verify it stays on login page (form doesn't submit with invalid data)
    cy.url().should("include", "/login");
  });

  it("should navigate to register page", () => {
    cy.contains("Sign up").click();
    cy.url().should("include", "/register");
  });
});
