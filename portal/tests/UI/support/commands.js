Cypress.Commands.add("chooseReactSelectOption", (selector, text, option) => {
  cy
    .get(`${selector} input`)
    .first()
    .click({ force: true })
    .type(text, { force: true })
    .get(`${selector} .styles__menu`)
    .contains(option)
    .click({ force: true });
});

 Cypress.Commands.add( "login" , () => {
   cy.server()
   cy.route('GET', '/api/translations/**').as('translations');
   cy.route('POST', '/login').as('loginUser');
   cy.route('POST', '/get/verified').as('verifyUser');
   cy.visit('/')
   cy.title().should('eq', 'bee•z link')
   cy.wait('@translations', {timeout: 30000});
   cy.get('.navBarLogin', {timeout: 30000}).click()
   cy.fixture('user').then(userJson => {
     cy.get('#inputEmail').should('be.enabled').type(userJson.name, {force: true})
     cy.get('#inputPassword').should('be.enabled').type(userJson.password, {force: true})
   })
   cy.get('form .btn-login').click();
   cy.wait('@loginUser')
   cy.wait('@verifyUser')
   cy.wait('@verifyUser')
 })

Cypress.Server.defaults({
  ignore: xhr => {
    return Cypress.config().blockHosts.some(blockedHost =>  // get blockHosts from cypress.json using Cypress.config()
      Cypress.minimatch(new URL(xhr.url).host, blockedHost)  // if current url matches any blockedHost item, return true
    )
  }
})
