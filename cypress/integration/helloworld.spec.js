describe('Visit Homepage', () => {
    it('should navigate to the home page', () => {
        // Start from the index page
        cy.visit('http://localhost:3456/');
    })
})
