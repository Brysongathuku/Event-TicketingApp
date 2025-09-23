// cypress/e2e/event-booking-positive.cy.js
describe("Event Booking - Positive Tests", () => {
  // Test data sets
  const testEvents = [
    {
      eventID: 1,
      title: "Summer Music Festival",
      ticketPrice: 50.0,
      availableTickets: 100,
      totalTickets: 200,
      eventDate: "2024-08-15T00:00:00.000Z",
      startTime: "2024-08-15T18:00:00.000Z",
      venueID: 1,
      imageUrl: "https://example.com/festival.jpg",
    },
    {
      eventID: 2,
      title: "Tech Conference 2024",
      ticketPrice: 75.0,
      availableTickets: 50,
      totalTickets: 150,
      eventDate: "2024-09-20T00:00:00.000Z",
      startTime: "2024-09-20T09:00:00.000Z",
      venueID: 2,
      imageUrl: "https://example.com/tech-conf.jpg",
    },
    {
      eventID: 3,
      title: "Art Exhibition Opening",
      ticketPrice: 25.0,
      availableTickets: 30,
      totalTickets: 50,
      eventDate: "2024-10-05T00:00:00.000Z",
      startTime: "2024-10-05T19:00:00.000Z",
      venueID: 3,
      imageUrl: "https://example.com/art-exhibition.jpg",
    },
  ];

  beforeEach(() => {
    // Mock the API response - try different patterns based on your API
    cy.intercept("GET", "**/api/events", {
      statusCode: 200,
      body: {
        data: testEvents,
        success: true,
      },
    }).as("getEvents");

    // Alternative intercept patterns if the above doesn't work:
    // cy.intercept('GET', '/api/events', { statusCode: 200, body: { data: testEvents } }).as('getEvents');
    // cy.intercept('GET', '**/events', { statusCode: 200, body: { data: testEvents } }).as('getEvents');

    // Visit your actual events page route
    cy.visit("/events"); // Change this to match your actual route

    // Wait for the events to load (optional - remove if not needed)
    cy.wait(1000); // Give the page time to load
  });

  // Test 1: Verify events display correctly
  it("should display all events with correct information", () => {
    // Verify page title
    cy.get('[data-testid="page-title"]')
      .should("be.visible")
      .should("contain", "Discover Amazing Events");

    // Verify events grid is displayed
    cy.get('[data-testid="events-grid"]').should("be.visible");

    // Verify each event card displays correct information
    testEvents.forEach((event) => {
      cy.get(`[data-testid="event-card-${event.eventID}"]`).should(
        "be.visible"
      );

      cy.get(`[data-testid="event-title-${event.eventID}"]`)
        .should("be.visible")
        .should("contain", event.title);

      cy.get(`[data-testid="event-price-${event.eventID}"]`)
        .should("be.visible")
        .should("contain", `$${event.ticketPrice}`);
    });
  });

  // Test 2: Book Now button navigation for first event
  it("should navigate to booking page when clicking Book Now for Summer Music Festival", () => {
    const event = testEvents[0]; // Summer Music Festival

    cy.get(`[data-testid="book-now-button-${event.eventID}"]`)
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain", "Book Now")
      .click();

    // Verify navigation to the correct booking page
    cy.url().should("include", `/book/${event.eventID}`);
  });

  // Test 3: Book Now button navigation for second event
  it("should navigate to booking page when clicking Book Now for Tech Conference 2024", () => {
    const event = testEvents[1]; // Tech Conference 2024

    cy.get(`[data-testid="book-now-button-${event.eventID}"]`)
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain", "Book Now")
      .click();

    // Verify navigation to the correct booking page
    cy.url().should("include", `/book/${event.eventID}`);
  });

  // Test 4: Book Now button navigation for third event
  it("should navigate to booking page when clicking Book Now for Art Exhibition Opening", () => {
    const event = testEvents[2]; // Art Exhibition Opening

    cy.get(`[data-testid="book-now-button-${event.eventID}"]`)
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain", "Book Now")
      .click();

    // Verify navigation to the correct booking page
    cy.url().should("include", `/book/${event.eventID}`);
  });

  // Test 5: Instant Pay button opens payment modal
  it("should open payment modal when clicking Instant Pay button", () => {
    const event = testEvents[0]; // Summer Music Festival

    cy.get(`[data-testid="instant-pay-button-${event.eventID}"]`)
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain", "Instant Pay")
      .click();

    // Since PaymentModal might not have data-testid yet, try alternative selectors
    // Option 1: Look for modal by class or role
    cy.get('[role="dialog"]').should("be.visible");

    // Option 2: Look for modal backdrop
    // cy.get('.modal-backdrop').should('be.visible');

    // Option 3: Look for payment modal content
    // cy.contains('Payment').should('be.visible');
  });

  // Test 6: Like button functionality works correctly
  it("should toggle like button when clicked", () => {
    const event = testEvents[0]; // Summer Music Festival
    const likeButton = cy.get(`[data-testid="like-button-${event.eventID}"]`);

    // Verify like button is visible
    likeButton.should("be.visible");

    // Initially not liked (should not have red background)
    likeButton.should("not.have.class", "bg-red-500");

    // Click to like
    likeButton.click();
    likeButton.should("have.class", "bg-red-500");

    // Click to unlike
    likeButton.click();
    likeButton.should("not.have.class", "bg-red-500");
  });
});

// cypress/support/commands.js
// Custom commands to support the tests
Cypress.Commands.add("verifyBookingNavigation", (eventID) => {
  cy.get(`[data-testid="book-now-button-${eventID}"]`)
    .should("be.visible")
    .should("not.be.disabled")
    .click();

  cy.url().should("include", `/book/${eventID}`);
});

Cypress.Commands.add("verifyEventCard", (event) => {
  cy.get(`[data-testid="event-card-${event.eventID}"]`).within(() => {
    cy.get(`[data-testid="event-title-${event.eventID}"]`).should(
      "contain",
      event.title
    );
    cy.get(`[data-testid="event-price-${event.eventID}"]`).should(
      "contain",
      `$${event.ticketPrice}`
    );
    cy.get(`[data-testid="book-now-button-${event.eventID}"]`).should(
      "not.be.disabled"
    );
  });
});
