describe('Test calendar', () => {
  beforeEach(() => {
    cy.login();
    Cypress.Cookies.preserveOnce('session_id', 'remember_token');
  });

  it('Create Operation', () => {
    cy.server()
    cy.route('POST', '/operation').as('addOperation');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-calendar > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get(':nth-child(2) > .rbc-row-bg > :nth-child(5)').click({force: true})
    cy.get('#name').type('Honey extraction', {force: true})
    cy.get('#description').type('Crush and drain method', {force: true})
    cy.fixture('data').then(({apiary1,beehive1}) => {
      cy.chooseReactSelectOption('#apiary_id','A.1',apiary1);
      cy.chooseReactSelectOption('#beehive_id','BeeHive',beehive1);
    })
    cy.get('#harvest').click({force: true})
    cy.get('#submit').click()
    cy.wait('@addOperation');

    cy.get('.c-sidebar-nav-dropdown-toggle',{timeout:6000}).click({force:true})
    cy.get('.sidebar-planned > .c-sidebar-nav-link',{timeout:6000}).click({force:true})
    cy.contains('Honey extraction')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Crush and drain method');
        cy.get('td').contains('harvest');
        cy.fixture('data').then(({beehive1}) => {cy.get('td').contains(beehive1)})
        cy.fixture('data').then(({apiary1}) => {cy.get('td').contains(apiary1)})
      })
  })

  it('Update Operation', () => {
    cy.server()
    cy.route('PUT', '/operation/**').as('editOperation');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-calendar > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get(':nth-child(2) > .rbc-row-content > .rbc-addons-dnd-row-body > .rbc-row > [style="flex-basis: 14.2857%; max-width: 14.2857%;"] > .rbc-event > .rbc-event-content > :nth-child(1)').click({force: true})
    cy.get('#name').should('have.value', 'Honey extraction')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#name').type('Another check health', {force: true})
    cy.get('#description').should('have.value', 'Crush and drain method')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#description').type('Regular inspection tasks to be repeated every 3 weeks', {force: true})
    cy.chooseReactSelectOption('#apiary_id','A.4','Apiary A.4');
    cy.chooseReactSelectOption('#beehive_id','A.1.1','BeeHive A.1.1');
    cy.get('#custom').click({force: true})
    cy.get('#submit').click()
    cy.wait('@editOperation');

    cy.get('.sidebar-calendar > .c-sidebar-nav-link').click({force: true})
    cy.contains('Another check health')
  })

  it('Move Operation', () => {
    cy.server()
    cy.route('PUT', 'operation/**').as('waitPlan');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-calendar > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get(':nth-child(2) > .rbc-row-content > .rbc-addons-dnd-row-body > .rbc-row > [style="flex-basis: 14.2857%; max-width: 14.2857%;"] > .rbc-event > .rbc-event-content > :nth-child(1)')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('mousemove', {
        pageX: 500,
        pageY: 500,
        force:true
      })
      .trigger('mouseup', {
        pageX: 500,
        pageY: 500,
        force: true })
    cy.wait('@waitPlan');

    cy.get('.rbc-event')
      .contains('Another check health')
  })

  it('Create Plan', () => {
    cy.server()
    cy.location('pathname').should('eq', '/panel')

    cy.route('GET', '/plan').as('allPlans');
    cy.route('POST', '/plan').as('addPlan');
    cy.get('.sidebar-calendar > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('.rbc-custom-label > :nth-child(4)').click({force: true})
    cy.get(':nth-child(6) > .rbc-row-bg > :nth-child(2)')
      .trigger('mousedown', {which: 1, button: 0})
    cy.get(':nth-child(6) > .rbc-row-bg > :nth-child(4)')
      .trigger('mousemove', {
        pageX: 0,
        pageY: 0,
      })
      .trigger('mouseup', {force: true})
    cy.get('#title').type('Late Winter plan', {force: true})
    cy.get('#description').type('Some description', {force: true})
    cy.get('#submit').click({ force: true })
    cy.wait('@addPlan');

    cy.get('.sidebar-calendar > .c-sidebar-nav-link').click({force: true})
    cy.contains('Late Winter plan')
  })

  it('Update Plan', () => {
    cy.server()
    cy.route('PUT', '/plan/**').as('updatePlan');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-calendar > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('.rbc-custom-label > :nth-child(4)').click({force: true})
    cy.get(':nth-child(2) > .rbc-row-content > .rbc-addons-dnd-row-body > :nth-child(1) > .rbc-row-segment > .rbc-event > .rbc-addons-dnd-resizable > .rbc-event-content > span').click({force: true})
    cy.get('#title').should('have.value', 'Late Winter plan')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#title').type('Early Fall to Winter', {force: true})
    cy.get('#description').should('have.value', 'Some description')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#description').type('Plan description', {force: true})
    cy.get('#submit').click()
    cy.wait('@updatePlan');

    cy.get('.sidebar-calendar > .c-sidebar-nav-link').click({force: true});
    cy.contains('Early Fall to Winter')
  })

  it('Reduce the duration of the plan', () => {
    cy.server()
    cy.location('pathname').should('eq', '/panel')

    cy.route('PUT', '/plan/**').as('waitPlan');
    cy.get('.sidebar-calendar > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('.rbc-custom-label > :nth-child(4)').click({force: true})
    cy.get(':nth-child(2) > .rbc-row-content > .rbc-addons-dnd-row-body > :nth-child(1) > .rbc-row-segment > .rbc-event > .rbc-addons-dnd-resizable > .rbc-event-content > span')
      .trigger('mousedown', {which: 1, button: 0})
      .trigger('mousemove', {
        pageX: 700,
        pageY: 300,
        force: true
      })
      .trigger('mouseup',
        {
          pageX: 700,
          pageY: 300,
          force: true
        })
    cy.wait('@waitPlan');

    cy.get('.sidebar-calendar > .c-sidebar-nav-link').click({force: true})
    cy.contains('Early Fall to Winter')
  })

})
