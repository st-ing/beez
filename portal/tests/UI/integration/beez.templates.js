import dayjs from "dayjs";
describe('Test templates', () => {
  beforeEach(() => {
    cy.login();
    cy.once('uncaught:exception', () => false);
   Cypress.Cookies.preserveOnce('session_id', 'remember_token');
  });
  it('Create Operation Template', () => {
    cy.server()
    cy.route('POST', '/operation').as('addOperation');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#operationTemplate > .nav-link').click({force: true})
    cy.get('#addOperationTemplate').click({force: true})
    cy.get('#name').type('Extraction', {force: true})
    cy.get('#description').type('Crush and drain method', {force: true})
    cy.fixture('data').then(({apiary1,beehive1}) => {
      cy.chooseReactSelectOption('#apiary_id','A.1',apiary1);
      cy.chooseReactSelectOption('#beehive_id','A.1.1',beehive1);
    })
    cy.chooseReactSelectOption('#plan_id','No p','No plan');
    cy.get('#harvest').click({force: true})
    cy.get('#submit').click()
    cy.wait('@addOperation');

    cy.get('.sidebar-template > .c-sidebar-nav-link').click()
    cy.get('#operationTemplate .active').click({force: true})
    cy.contains('Extraction')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Crush and drain method');
        cy.get('td').contains('No plan')
        cy.fixture('data').then(({beehive1}) => {cy.get('td').contains(beehive1)})
        cy.fixture('data').then(({apiary1}) => {cy.get('td').contains(apiary1)})
      })
  })

  it('Update Operation Template', () => {
    cy.server()
    cy.route('PUT', '/operation/**').as('editOperation');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#operationTemplate > .nav-link').click({force: true})
    cy.contains('Labelling')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Inventory checking');
        cy.get('td').get(`[title="Update"]`).click({ force: true });
      })
    cy.get('#name').should('have.value', 'Labelling')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#name').type('Labelling edited', {force: true})
    cy.get('#description').should('have.value', 'Inventory checking')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#description').type('Inventory checking edited', {force: true})
      cy.chooseReactSelectOption('#apiary_id','A.4','Apiary A.4');
      cy.chooseReactSelectOption('#beehive_id','A.1.1','BeeHive A.1.1');
    cy.get('#custom').click({force: true})
    cy.get('#submit').click()
    cy.wait('@editOperation');

    cy.get('.sidebar-template > .c-sidebar-nav-link').click()
    cy.get('#operationTemplate .active').click({force: true})
    cy.contains('Labelling edited')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Inventory checking edited');
        cy.get('td').contains('Apiary A.4');
        cy.get('td').contains('BeeHive A.1.1');
      })
  })

  it('Initialize Operation Template', () => {
    cy.server()
    cy.route('POST', '/operation/initialize').as('initializeOperation');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#operationTemplate > .nav-link').click({force: true})
    cy.contains('Beehive Inspection and Investigation of the stress')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('analysis');
        cy.get('td').get(`[title="Initialize"]`).click({ force: true });
      })
    cy.get('#name').should('have.value', 'Beehive Inspection and Investigation of the stress')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#name').type('Beehive Inspection and Investigation of the stress edited', {force: true})
    cy.get('#description').should('have.value', '')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#description').type('Some description', {force: true})
    cy.chooseReactSelectOption('#apiary_id','A.4','Apiary A.4');
    cy.chooseReactSelectOption('#beehive_id','A.1.1','BeeHive A.1.1');
    cy.get('#custom').click({force: true})
    cy.get('#submit').click()
    cy.wait('@initializeOperation');

    cy.get('.c-sidebar-nav-dropdown-toggle').click({force: true})
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({force: true})
    cy.contains('Beehive Inspection and Investigation of the stress edited')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Some description');
        cy.get('td').contains('Apiary A.4');
        cy.get('td').contains('BeeHive A.1.1');
      })
  })

  it('Delete Operation Template ', () => {
    cy.server()
    cy.route('DELETE', '/operation/**').as('deleteOperation');

    cy.location('pathname').should('eq', '/panel');
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#operationTemplate > .nav-link').click({force: true})
    cy.contains('Honey extraction')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Crush and drain method');
        cy.get('td').contains('harvest');
        cy.get('td').contains('No plan');
        cy.get('td').get('[title="Delete"]').click({force: true});
      })
    cy.get('.active > :nth-child(2) > .modal > .modal-dialog > .modal-content > .sc-lllmON > #deleteYes').click({force: true});
    cy.wait('@deleteOperation');

    cy.contains('Honey extraction')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Crush and drain method').should('not.exist');
      })
  })

  it('Create Plan Template', () => {
    cy.server()
    cy.route('GET', '/plans/templates').as('getAllPlanTemplates');
    cy.route('POST', '/plan').as('addPlan');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#planTemplate > .active').click({force: true})
    cy.wait('@getAllPlanTemplates');
    cy.get('#addPlanTemplate').click({force: true})
    cy.get('#title').type('Summer plan', {force: true})
    cy.get('#description').type('description', {force: true})
    const targetDate = dayjs().format('YYYY-MM-DD')
    cy.get(':nth-child(3) > :nth-child(1) > .DayPickerInput > input').clear({ force: true })
      .should('have.value', '')
      .type(`${targetDate}{enter}`)
    cy.get(':nth-child(4) > :nth-child(1) > .DayPickerInput > input').clear({ force: true })
      .should('have.value', '').type(`${targetDate}{enter}`)
    cy.get('#submit').click({force:true})
    cy.wait('@addPlan');

    cy.get('.sidebar-template > .c-sidebar-nav-link').click()
    cy.get('#planTemplate').click({force: true})
    cy.contains('td','Summer plan').siblings()
      .within(() => {
        cy.contains('description')
        cy.contains(dayjs().format('YYYY-MM-DD'))
        cy.contains(dayjs().format('YYYY-MM-DD'))
      })
  })

  it('Update Plan Template', () => {
    cy.server()
    cy.route('GET', '/plans/templates').as('getAllPlanTemplates');
    cy.route('PUT', '/plan/**').as('updatePlan');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#planTemplate > .active').click({force: true})
    cy.wait('@getAllPlanTemplates');
    cy.contains('Late Fall Plan')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Ensure proper nutrition and winterize colonies')
        cy.get('td').contains(dayjs().format('2022-12-05'))
        cy.get('td').contains(dayjs().format('2022-12-22'))
        cy.get('td').get(`[title="Update"]`).click({ force: true });
      })
    cy.get('#title').should('have.value', 'Late Fall Plan')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#title').type('Late Fall Plan edited', {force: true})
    cy.get('#description').should('have.value', 'Ensure proper nutrition and winterize colonies')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#description').type('Ensure proper nutrition', {force: true})
    cy.get('#submit').click()
    cy.wait('@updatePlan');

    cy.get('.sidebar-template > .c-sidebar-nav-link').click({force: true})
    cy.get('#planTemplate').click({force: true})
    cy.contains('Late Fall Plan edited')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Ensure proper nutrition');
        cy.get('td').contains(dayjs().format('2022-12-05'))
        cy.get('td').contains(dayjs().format('2022-12-22'))
      })
  })

  it('Initialize Plan Template Without Operations', () => {
    cy.server()
    cy.route('GET', '/plans/templates').as('getAllPlanTemplates');
    cy.route('POST', '/plan/initialize/**').as('initializePlan');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#planTemplate > .active').click({force: true})
    cy.wait('@getAllPlanTemplates');
    cy.contains('td','Late Winter/Early Spring')
      .siblings()
      .within(() => {
        cy.contains('Keep apiaries tidy and remove dead out equipment.');
        cy.contains(dayjs().format('2022-03-10'))
        cy.contains(dayjs().format('2022-03-23'))
        cy.get(`[title="initialize"]`).click({ force: true });
      })
    cy.get('#title').should('have.value', 'Late Winter/Early Spring')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#title').type('Late Winter to Early Spring', {force: true})
    cy.get('#description').should('have.value', 'Keep apiaries tidy and remove dead out equipment.')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#description').type('Keep apiaries tidy', {force: true})
    cy.get('#submit').click({force: true})
    cy.wait('@initializePlan');

    cy.get('.sidebar-plans > .c-sidebar-nav-link').click({force:true})
    cy.contains('Late Winter to Early Spring')
  })

  it('Initialize Plan Template With Operations', () => {
    cy.server()
    cy.route('GET', '/plans/templates').as('getAllPlanTemplates');
    cy.route('POST', '/plan/initialize/**').as('initializePlan');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#planTemplate > .active').click({force: true})
    cy.wait('@getAllPlanTemplates');
    cy.contains('td','Late Winter/Early Spring')
      .siblings()
      .within(() => {
        cy.contains('Keep apiaries tidy and remove dead out equipment.');
        cy.contains(dayjs().format('2022-03-10'));
        cy.contains(dayjs().format('2022-03-23'));
        cy.get(`[title="initialize"]`).click({ force: true });
      })
    cy.get('#title').should('have.value', 'Late Winter/Early Spring')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#title').type('New Late Winter plan', {force: true})
    cy.get('#description').should('have.value', 'Keep apiaries tidy and remove dead out equipment.')
      .clear({force: true})
      .should('have.value', '')
    cy.get('#description').type('Keep apiaries tidy', {force: true})
    cy.get('.text-right > .sc-jrcTuL').click({force:true})
    cy.get('#submit').click({force: true})
    cy.wait('@initializePlan');

    cy.get('.sidebar-plans > .c-sidebar-nav-link').click({force:true})
    cy.contains('New Late Winter plan');
  })

  it('Delete Plan Template', () => {
    cy.server()
    cy.route('DELETE', '/plan/**').as('deletePlan');
    cy.route('GET', '/plans/templates').as('getAllPlanTemplates');

    cy.location('pathname').should('eq','/panel');
    cy.get('.sidebar-template > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#planTemplate > .active').click({force: true})
    cy.wait('@getAllPlanTemplates',{timeout:6000});
    cy.contains('After Summer Check')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Instead of opening the hive,test the weight');
        cy.get('td').contains(dayjs().format('2022-09-21'));
        cy.get('td').contains(dayjs().format('2022-09-22'));
        cy.get('td').get('[title="Delete"]').click({ force: true });
      })
    cy.get('#deleteYes').click({force: true});
    cy.wait('@deletePlan');

    cy.contains('After Summer Check').should('not.exist');
    })
})
