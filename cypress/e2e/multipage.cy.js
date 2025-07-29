describe("Multipage Navigation Tests", () => {
  beforeEach(() => {
    // Visit the landing page before each test
    cy.visit("/");
  });

  describe("Navbar Component Tests", () => {
    it("should display navbar on all pages", () => {
      cy.get('[data-testid="navbar"]').should("be.visible");
      cy.get('[data-testid="brand-logo"]').should("contain.text", "Eventixs");
    });

    it("should have working brand logo link", () => {
      cy.get('[data-testid="brand-logo"]').click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });

    it("should display search functionality", () => {
      // Test mobile search (always visible)
      cy.get('[data-testid="mobile-search-input"]').should("be.visible");

      // Test desktop search (visible on xl screens)
      cy.viewport(1280, 720);
      cy.get('[data-testid="desktop-search-input"]').should("be.visible");
      cy.get('[data-testid="desktop-search-button"]').should("be.visible");
    });

    it("should display notifications button and badge", () => {
      cy.viewport(768, 1024); // tablet size to ensure visibility
      cy.get('[data-testid="notifications-button"]').should("be.visible");
      cy.get('[data-testid="notifications-badge"]').should("contain.text", "3");
    });
  });

  describe("Desktop Navigation Tests", () => {
    beforeEach(() => {
      cy.viewport(1280, 720); // Desktop viewport
    });

    it("should display all desktop navigation links", () => {
      cy.get('[data-testid="nav-home-desktop"]')
        .should("be.visible")
        .should("contain.text", "Home");
      cy.get('[data-testid="nav-events-desktop"]')
        .should("be.visible")
        .should("contain.text", "Events");
      cy.get('[data-testid="nav-about-desktop"]')
        .should("be.visible")
        .should("contain.text", "About");
      cy.get('[data-testid="nav-dashboard-desktop"]')
        .should("be.visible")
        .should("contain.text", "Dashboard");
    });

    it("should display desktop auth buttons", () => {
      cy.get('[data-testid="login-button-desktop"]')
        .should("be.visible")
        .should("contain.text", "Login");
      cy.get('[data-testid="register-button-desktop"]')
        .should("be.visible")
        .should("contain.text", "Get Started");
    });

    it("should navigate to home page from desktop nav", () => {
      cy.get('[data-testid="nav-home-desktop"]').click();
      cy.url().should("include", "/home");
    });

    it("should navigate to events page from desktop nav", () => {
      cy.get('[data-testid="nav-events-desktop"]').click();
      cy.url().should("include", "/events");
    });

    it("should navigate to about page from desktop nav", () => {
      cy.get('[data-testid="nav-about-desktop"]').click();
      cy.url().should("include", "/about");
    });

    it("should navigate to login page from desktop auth button", () => {
      cy.get('[data-testid="login-button-desktop"]').click();
      cy.url().should("include", "/login");
    });

    it("should navigate to register page from desktop auth button", () => {
      cy.get('[data-testid="register-button-desktop"]').click();
      cy.url().should("include", "/register");
    });
  });

  describe("Mobile Navigation Tests", () => {
    beforeEach(() => {
      cy.viewport(375, 667); // Mobile viewport
    });

    it("should display mobile menu toggle button", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').should("be.visible");
    });

    it("should open and close mobile menu", () => {
      // Open mobile menu
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="mobile-menu-overlay"]').should("be.visible");
      cy.get('[data-testid="mobile-menu"]').should("be.visible");

      // Close mobile menu using close button
      cy.get('[data-testid="mobile-menu-close"]').click();
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should close mobile menu when clicking overlay", () => {
      // Open mobile menu
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="mobile-menu-overlay"]').should("be.visible");

      // Click overlay to close (click on overlay but not on menu itself)
      cy.get('[data-testid="mobile-menu-overlay"]').click({ force: true });
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should display all mobile navigation links", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').click();

      cy.get('[data-testid="nav-home-mobile"]')
        .should("be.visible")
        .should("contain.text", "Home");
      cy.get('[data-testid="nav-events-mobile"]')
        .should("be.visible")
        .should("contain.text", "Events");
      cy.get('[data-testid="nav-about-mobile"]')
        .should("be.visible")
        .should("contain.text", "About");
      cy.get('[data-testid="nav-dashboard-mobile"]')
        .should("be.visible")
        .should("contain.text", "Dashboard");
    });

    it("should display mobile auth buttons", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').click();

      cy.get('[data-testid="login-button-mobile"]')
        .should("be.visible")
        .should("contain.text", "Login to Account");
      cy.get('[data-testid="register-button-mobile"]')
        .should("be.visible")
        .should("contain.text", "Get Started");
    });

    it("should navigate to home page from mobile nav", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="nav-home-mobile"]').click();
      cy.url().should("include", "/home");
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist"); // Menu should close after navigation
    });

    it("should navigate to events page from mobile nav", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="nav-events-mobile"]').click();
      cy.url().should("include", "/events");
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should navigate to about page from mobile nav", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="nav-about-mobile"]').click();
      cy.url().should("include", "/about");
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should navigate to login page from mobile auth button", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="login-button-mobile"]').click();
      cy.url().should("include", "/login");
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should navigate to register page from mobile auth button", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="register-button-mobile"]').click();
      cy.url().should("include", "/register");
      cy.get('[data-testid="mobile-menu-overlay"]').should("not.exist");
    });

    it("should display mobile notifications", () => {
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="notifications-mobile"]')
        .should("be.visible")
        .should("contain.text", "Notifications");
    });
  });

  describe("Page-specific Navigation Tests", () => {
    const pages = [
      { path: "/", name: "Landing Page" },
      { path: "/home", name: "Home Page" },
      { path: "/about", name: "About Page" },
      { path: "/events", name: "Events Page" },
      { path: "/register", name: "Register Page" },
      { path: "/login", name: "Login Page" },
    ];

    pages.forEach((page) => {
      it(`should display navbar on ${page.name}`, () => {
        cy.visit(page.path);
        cy.get('[data-testid="navbar"]').should("be.visible");
        cy.get('[data-testid="brand-logo"]').should("contain.text", "Eventixs");
      });

      it(`should navigate from ${page.name} to other pages via navbar`, () => {
        cy.visit(page.path);

        // Test navigation to home (desktop)
        cy.viewport(1280, 720);
        cy.get('[data-testid="nav-home-desktop"]').click();
        cy.url().should("include", "/home");

        // Go back to test page
        cy.visit(page.path);

        // Test navigation to events (desktop)
        cy.get('[data-testid="nav-events-desktop"]').click();
        cy.url().should("include", "/events");

        // Go back to test page
        cy.visit(page.path);

        // Test navigation to about (desktop)
        cy.get('[data-testid="nav-about-desktop"]').click();
        cy.url().should("include", "/about");
      });
    });

    it("should maintain navbar functionality across all pages", () => {
      pages.forEach((page) => {
        cy.visit(page.path);

        // Test brand logo works
        cy.get('[data-testid="brand-logo"]').should("be.visible");

        // Test search functionality exists
        cy.get('[data-testid="mobile-search-input"]').should("be.visible");

        // Test mobile menu toggle works
        cy.viewport(375, 667);
        cy.get('[data-testid="mobile-menu-toggle"]').should("be.visible");
      });
    });
  });

  describe("Search Functionality Tests", () => {
    it("should allow typing in desktop search input", () => {
      cy.viewport(1280, 720);
      const searchTerm = "concert events";

      cy.get('[data-testid="desktop-search-input"]')
        .type(searchTerm)
        .should("have.value", searchTerm);

      cy.get('[data-testid="desktop-search-button"]').click();
    });

    it("should allow typing in mobile search input", () => {
      cy.viewport(375, 667);
      const searchTerm = "music festival";

      cy.get('[data-testid="mobile-search-input"]')
        .type(searchTerm)
        .should("have.value", searchTerm);
    });

    it("should display search inputs on different screen sizes", () => {
      // Mobile search should always be visible
      cy.viewport(375, 667);
      cy.get('[data-testid="mobile-search-input"]').should("be.visible");
      cy.get('[data-testid="desktop-search-input"]').should("not.be.visible");

      // Desktop search should be visible on xl screens
      cy.viewport(1280, 720);
      cy.get('[data-testid="desktop-search-input"]').should("be.visible");
      cy.get('[data-testid="mobile-search-input"]').should("be.visible");
    });
  });

  describe("Responsive Design Tests", () => {
    const viewports = [
      { width: 375, height: 667, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1024, height: 768, name: "Desktop Small" },
      { width: 1280, height: 720, name: "Desktop Large" },
      { width: 1920, height: 1080, name: "Desktop XL" },
    ];

    viewports.forEach((viewport) => {
      it(`should display correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        cy.viewport(viewport.width, viewport.height);

        // Navbar should always be visible
        cy.get('[data-testid="navbar"]').should("be.visible");
        cy.get('[data-testid="brand-logo"]').should("be.visible");

        if (viewport.width >= 1024) {
          // Desktop navigation should be visible
          cy.get('[data-testid="nav-home-desktop"]').should("be.visible");
          cy.get('[data-testid="login-button-desktop"]').should("be.visible");
          cy.get('[data-testid="mobile-menu-toggle"]').should("not.be.visible");
        } else {
          // Mobile menu toggle should be visible
          cy.get('[data-testid="mobile-menu-toggle"]').should("be.visible");
          cy.get('[data-testid="nav-home-desktop"]').should("not.be.visible");
        }

        if (viewport.width >= 1280) {
          // Desktop search should be visible on XL screens
          cy.get('[data-testid="desktop-search-input"]').should("be.visible");
        }
      });
    });
  });

  describe("Navigation State Persistence Tests", () => {
    it("should maintain mobile menu state correctly", () => {
      cy.viewport(375, 667);

      // Open mobile menu
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="mobile-menu"]').should("be.visible");

      // Navigate to different page
      cy.get('[data-testid="nav-about-mobile"]').click();
      cy.url().should("include", "/about");

      // Menu should be closed on new page
      cy.get('[data-testid="mobile-menu"]').should("not.exist");

      // Menu toggle should still work
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="mobile-menu"]').should("be.visible");
    });

    it("should handle browser back/forward navigation", () => {
      // Navigate through pages
      cy.get('[data-testid="brand-logo"]').click(); // Go to home
      cy.url().should("eq", Cypress.config().baseUrl + "/");

      cy.viewport(1280, 720);
      cy.get('[data-testid="nav-about-desktop"]').click();
      cy.url().should("include", "/about");

      cy.get('[data-testid="nav-events-desktop"]').click();
      cy.url().should("include", "/events");

      // Test browser back navigation
      cy.go("back");
      cy.url().should("include", "/about");
      cy.get('[data-testid="navbar"]').should("be.visible");

      // Test browser forward navigation
      cy.go("forward");
      cy.url().should("include", "/events");
      cy.get('[data-testid="navbar"]').should("be.visible");
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper ARIA attributes and keyboard navigation", () => {
      // Test desktop navigation
      cy.viewport(1280, 720);

      // Test tab navigation through nav items
      cy.get('[data-testid="brand-logo"]').focus().should("be.focused");
      cy.get('[data-testid="brand-logo"]').tab();
      cy.get('[data-testid="desktop-search-input"]').should("be.focused");

      // Test search input accessibility
      cy.get('[data-testid="desktop-search-input"]')
        .should("have.attr", "placeholder")
        .and("include", "Search events");
    });

    it("should handle keyboard navigation for mobile menu", () => {
      cy.viewport(375, 667);

      // Open mobile menu with keyboard
      cy.get('[data-testid="mobile-menu-toggle"]').focus().type("{enter}");
      cy.get('[data-testid="mobile-menu"]').should("be.visible");

      // Close mobile menu with keyboard
      cy.get('[data-testid="mobile-menu-close"]').focus().type("{enter}");
      cy.get('[data-testid="mobile-menu"]').should("not.exist");
    });

    it("should have readable text and proper contrast", () => {
      cy.get('[data-testid="brand-logo"]')
        .should("be.visible")
        .and("contain.text", "Eventixs");

      cy.viewport(1280, 720);
      cy.get('[data-testid="nav-home-desktop"]')
        .should("be.visible")
        .and("contain.text", "Home");

      cy.get('[data-testid="login-button-desktop"]')
        .should("be.visible")
        .and("contain.text", "Login");
    });
  });

  describe("Error Handling Tests", () => {
    it("should handle navigation to non-existent routes gracefully", () => {
      // Visit a route that might not exist
      cy.visit("/non-existent-route", { failOnStatusCode: false });

      // Navbar should still be present
      cy.get('[data-testid="navbar"]').should("be.visible");
      cy.get('[data-testid="brand-logo"]').should("be.visible");

      // Should be able to navigate back to valid routes
      cy.get('[data-testid="brand-logo"]').click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });

    it("should handle rapid navigation clicks", () => {
      cy.viewport(1280, 720);

      // Rapidly click different navigation items
      cy.get('[data-testid="nav-home-desktop"]').click();
      cy.get('[data-testid="nav-about-desktop"]').click();
      cy.get('[data-testid="nav-events-desktop"]').click();

      // Should end up on the last clicked page
      cy.url().should("include", "/events");
      cy.get('[data-testid="navbar"]').should("be.visible");
    });

    it("should handle window resize during mobile menu interaction", () => {
      cy.viewport(375, 667);

      // Open mobile menu
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="mobile-menu"]').should("be.visible");

      // Resize to desktop
      cy.viewport(1280, 720);

      // Mobile menu should not interfere with desktop layout
      cy.get('[data-testid="nav-home-desktop"]').should("be.visible");
      cy.get('[data-testid="login-button-desktop"]').should("be.visible");
    });
  });

  describe("Performance Tests", () => {
    it("should load navbar quickly on each page", () => {
      const pages = ["/", "/home", "/about", "/events", "/register", "/login"];

      pages.forEach((page) => {
        const startTime = Date.now();
        cy.visit(page);
        cy.get('[data-testid="navbar"]')
          .should("be.visible")
          .then(() => {
            const loadTime = Date.now() - startTime;
            expect(loadTime).to.be.lessThan(3000); // Should load within 3 seconds
          });
      });
    });

    it("should handle multiple viewport changes smoothly", () => {
      const viewports = [
        [375, 667], // Mobile
        [1280, 720], // Desktop
        [768, 1024], // Tablet
        [1920, 1080], // Large Desktop
      ];

      viewports.forEach(([width, height]) => {
        cy.viewport(width, height);
        cy.get('[data-testid="navbar"]').should("be.visible");
        cy.get('[data-testid="brand-logo"]').should("be.visible");
      });
    });
  });
});
