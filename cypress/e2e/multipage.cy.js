describe("Navbar Multipage Navigation Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Brand Logo Navigation", () => {
    it("should navigate to home when clicking brand logo", () => {
      // From any page, clicking brand should go to home
      cy.visit("/about");
      cy.get('[data-testid="brand-logo"]').first().click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });

    it("should display brand logo on all main pages", () => {
      const pages = ["/", "/home", "/about", "/events"];

      pages.forEach((page) => {
        cy.visit(page);
        cy.get('[data-testid="brand-logo"]').first().should("be.visible");
        cy.get('[data-testid="brand-logo"]')
          .first()
          .should("contain.text", "Eventixs");
      });
    });
  });

  describe("Desktop Navigation", () => {
    beforeEach(() => {
      cy.viewport(1280, 720); // Desktop viewport
    });

    it("should navigate to Home page from desktop nav", () => {
      cy.get('[data-testid="nav-home-desktop"]').first().click();
      cy.url().should("include", "/home");
      cy.get('[data-testid="navbar"]').first().should("be.visible");
    });

    it("should navigate to Events page from desktop nav", () => {
      cy.get('[data-testid="nav-events-desktop"]').first().click();
      cy.url().should("include", "/events");
      cy.get('[data-testid="navbar"]').first().should("be.visible");
    });

    it("should navigate to About page from desktop nav", () => {
      cy.get('[data-testid="nav-about-desktop"]').first().click();
      cy.url().should("include", "/about");
      cy.get('[data-testid="navbar"]').first().should("be.visible");
    });

    it("should navigate to Dashboard from desktop nav", () => {
      cy.get('[data-testid="nav-dashboard-desktop"]').first().click();
      cy.url().should("include", "/admin/dashboard/events");
    });
  });

  describe("Auth Buttons Navigation", () => {
    beforeEach(() => {
      cy.viewport(1280, 720); // Desktop viewport for auth buttons
    });

    it("should navigate to Login page from desktop auth button", () => {
      cy.get('[data-testid="login-button-desktop"]').first().click();
      cy.url().should("include", "/login");
    });

    it("should navigate to Register page from Get Started button", () => {
      cy.get('[data-testid="register-button-desktop"]').first().click();
      cy.url().should("include", "/register");
    });
  });

  describe("Mobile Navigation", () => {
    beforeEach(() => {
      cy.viewport(375, 667); // Mobile viewport
    });

    it("should open and close mobile menu", () => {
      // Open mobile menu
      cy.get('[data-testid="mobile-menu-toggle"]').first().click();
      cy.get('[data-testid="mobile-menu-overlay"]').should("be.visible");
      cy.get('[data-testid="mobile-menu"]').should("be.visible");

      // Close mobile menu
      cy.get('[data-testid="mobile-menu-close"]').click();
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should navigate to Home from mobile menu", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').first().click();
      cy.get('[data-testid="nav-home-mobile"]').click();
      cy.url().should("include", "/home");
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should navigate to Events from mobile menu", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').first().click();
      cy.get('[data-testid="nav-events-mobile"]').click();
      cy.url().should("include", "/events");
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should navigate to About from mobile menu", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').first().click();
      cy.get('[data-testid="nav-about-mobile"]').click();
      cy.url().should("include", "/about");
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should navigate to Login from mobile menu", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').first().click();
      cy.get('[data-testid="login-button-mobile"]').click();
      cy.url().should("include", "/login");
    });

    it("should navigate to Register from mobile menu", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').first().click();
      cy.get('[data-testid="register-button-mobile"]').click();
      cy.url().should("include", "/register");
    });
  });

  describe("Cross-Page Navigation Flow", () => {
    it("should navigate through multiple pages and maintain functionality", () => {
      cy.viewport(1280, 720);

      // Start at home
      cy.get('[data-testid="nav-home-desktop"]').first().click();
      cy.url().should("include", "/home");

      // Go to events
      cy.get('[data-testid="nav-events-desktop"]').first().click();
      cy.url().should("include", "/events");

      // Go to about
      cy.get('[data-testid="nav-about-desktop"]').first().click();
      cy.url().should("include", "/about");

      // Return home via brand logo
      cy.get('[data-testid="brand-logo"]').first().click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });

    it("should handle browser back/forward navigation", () => {
      cy.viewport(1280, 720);

      // Navigate through pages
      cy.get('[data-testid="nav-about-desktop"]').first().click();
      cy.url().should("include", "/about");

      cy.get('[data-testid="nav-events-desktop"]').first().click();
      cy.url().should("include", "/events");

      // Test browser back
      cy.go("back");
      cy.url().should("include", "/about");
      cy.get('[data-testid="navbar"]').first().should("be.visible");

      // Test browser forward
      cy.go("forward");
      cy.url().should("include", "/events");
      cy.get('[data-testid="navbar"]').first().should("be.visible");
    });
  });

  describe("Responsive Behavior", () => {
    const viewports = [
      { width: 375, height: 667, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1280, height: 720, name: "Desktop" },
    ];

    viewports.forEach((viewport) => {
      it(`should display correctly on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);

        // Navbar should always be visible on main pages
        cy.get('[data-testid="navbar"]').first().should("be.visible");
        cy.get('[data-testid="brand-logo"]').first().should("be.visible");

        if (viewport.width >= 1024) {
          // Desktop navigation should be visible
          cy.get('[data-testid="nav-home-desktop"]')
            .first()
            .should("be.visible");
          cy.get('[data-testid="mobile-menu-toggle"]').should("not.be.visible");
        } else {
          // Mobile menu toggle should be visible
          cy.get('[data-testid="mobile-menu-toggle"]')
            .first()
            .should("be.visible");
        }
      });
    });
  });
});
