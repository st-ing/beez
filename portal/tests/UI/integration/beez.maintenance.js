import dayjs from "dayjs";
describe('Test operations and plans', () => {
  beforeEach(() => {
    cy.login();
    Cypress.Cookies.preserveOnce('session_id', 'remember_token');
  });
  it('Create Operation-type harvest', () => {
    cy.server()
    cy.route('POST', '/operation').as('addOperation');

    cy.location('pathname').should('eq','/panel');
    cy.get('.c-sidebar-nav-dropdown-toggle', {timeout:6000}).click({force: true})
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({ force: true });
    cy.get('#addPlannedOperation').click({ force: true });
    cy.get('#name').type('New planned operation with harvest type',{ force: true });
    cy.get('#description').type('some description',{force:true});
    cy.fixture('data').then(({apiary1,beehive1}) => {
      cy.chooseReactSelectOption('#apiary_id','A.1',apiary1);
      cy.chooseReactSelectOption('#beehive_id','A.1.1',beehive1);
    })
    cy.get('#harvest').click( {force: true})
    cy.get('#harvest_honey').type('Unknown',{ force: true });
    cy.get('#harvest_weight').type('0',{force:true});
    cy.get('#harvest_batch_id').type('12586',{ force: true });
    cy.get('#submit').click();
    cy.wait('@addOperation');

    cy.get('.c-sidebar-nav-dropdown-toggle').click({force: true})
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({force: true})
    cy.contains('New planned operation with harvest type')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('some description');
        cy.get('td').contains('BeeHive A.1.1')
        cy.get('td').contains('Apiary A.1')
      })
  })

  it('Create Operation-type interventions', () => {
    cy.server()
    cy.route('POST', '/operation').as('addOperation');

    cy.location('pathname').should('eq','/panel');
    cy.get('.c-sidebar-nav-dropdown-toggle',{timeout:6000}).click({ force: true });
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({ force: true });
    cy.get('#addPlannedOperation').click({ force: true });
    cy.get('#name').type('New planned operation with interventions type',{ force: true });
    cy.get('#description').type('some description',{force:true});
    cy.fixture('data').then(({apiary1,beehive1}) => {
      cy.chooseReactSelectOption('#apiary_id','A.1',apiary1);
      cy.chooseReactSelectOption('#beehive_id','A.1.1',beehive1);
    })
    cy.get('#interventions').click({force: true})
    cy.get('#submit').click();
    cy.wait('@addOperation');

    cy.get('.c-sidebar-nav-dropdown-toggle').click({force: true})
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({force: true})
    cy.contains('New planned operation with interventions type')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('some description');
        cy.get('td').contains('BeeHive A.1.1')
        cy.get('td').contains('Apiary A.1')
      })
  })
  it('Create Operation-type analysis', () => {
    cy.server()
    cy.route('POST', '/operation').as('addOperation');

    cy.location('pathname').should('eq','/panel');
    cy.get('.c-sidebar-nav-dropdown-toggle',{timeout:6000}).click({ force: true });
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({ force: true });
    cy.get('#addPlannedOperation').click({ force: true });
    cy.get('#name').type('New planned operation with analysis type',{ force: true });
    cy.get('#description').type('some description',{force:true});
    cy.fixture('data').then(({apiary1,beehive1}) => {
      cy.chooseReactSelectOption('#apiary_id','A.1',apiary1);
      cy.chooseReactSelectOption('#beehive_id','A.1.1',beehive1);
    })
    cy.get('#analysis').click({force: true})
    cy.get('#submit').click();
    cy.wait('@addOperation');

    cy.get('.c-sidebar-nav-dropdown-toggle').click({force: true})
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({force: true})
    cy.contains('New planned operation with analysis type')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('some description');
        cy.get('td').contains('BeeHive A.1.1')
        cy.get('td').contains('Apiary A.1')
      })
  })

  it('Create Operation-type custom', () => {
    cy.server()
    cy.route('POST', '/operation').as('addOperation');

    cy.location('pathname').should('eq','/panel');
    cy.get('.c-sidebar-nav-dropdown-toggle',{timeout:6000}).click({ force: true });
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({ force: true });
    cy.get('#addPlannedOperation').click({ force: true });
    cy.get('#name').type('New planned operation with custom type',{ force: true });
    cy.get('#description').type('some description',{force:true});
    cy.fixture('data').then(({apiary1,beehive1}) => {
      cy.chooseReactSelectOption('#apiary_id','A.1',apiary1);
      cy.chooseReactSelectOption('#beehive_id','A.1.1',beehive1);
    })
    cy.get('#custom').click({force: true})
    cy.get('#submit').click();
    cy.wait('@addOperation');

    cy.get('.c-sidebar-nav-dropdown-toggle').click({force: true})
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({force: true})
    cy.contains('New planned operation with custom type')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('some description');
        cy.get('td').contains('BeeHive A.1.1')
        cy.get('td').contains('Apiary A.1')
      })
  })

  it('Edit Operation', () => {
    cy.server()
    cy.route('PUT', '/operation/**').as('editOperation');

    cy.location('pathname').should('eq','/panel');
    cy.get('.c-sidebar-nav-dropdown-toggle',{timeout:6000}).click({ force: true });
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({ force: true });
    cy.contains('New planned operation with harvest type')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('some description');
        cy.get('td').get(`[title="Update"]`).click({ force: true });
      })
    cy.get('#name').should('have.value','New planned operation with harvest type')
      .clear({ force: true })
      .should('have.value', '')
    cy.get('#name').type('Swarming check edited',{ force: true })
    cy.get('#description').should('have.value','some description')
      .clear({ force: true })
      .should('have.value', '')
    cy.get('#description').type('Regular inspection tasks to be repeated every 15 days.',{ force: true })
    cy.get('#analysis').click({force:true});
    cy.get('#submit').click({ force: true })
    cy.wait('@editOperation');

    cy.contains('Swarming check edited')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Regular inspection tasks to be repeated every 15 days.')
        cy.get('td').contains('planned');
        cy.get('td').contains('analysis')
      })
  })

  it('Start and Finish Operation', () => {
    cy.server()
    cy.route('PUT', '/operation/**').as('editOperation');
    cy.route('GET', '/operation/planned').as('allPlanned');
    cy.route('GET', '/operation/ongoing').as('allOngoing');
    cy.route('GET', '/operation/finished').as('allFinished');

    cy.location('pathname').should('eq','/panel');
    cy.get('.c-sidebar-nav-dropdown-toggle',{timeout:6000}).click({ force: true });
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({ force: true });
    cy.wait('@allPlanned');
    cy.contains('New planned operation with custom type')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('some description');
        cy.get('td').eq(2).contains('planned');
        cy.get('td').eq(4).contains('custom');
        cy.get('td').eq(9).get(`[title="Start operation"]`).click({ force: true });
      })
    cy.wait('@editOperation');
    cy.wait('@allOngoing');
    cy.get('.sidebar-ongoing > .c-sidebar-nav-link').click({ force: true });
    cy.contains('New planned operation with custom type')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('some description');
        cy.get('td').eq(2).contains('started');
        cy.get('td').eq(4).contains('custom');
        cy.get('td').eq(9).get(`[title="Finish operation"]`).click({ force: true });
      })
    cy.wait('@editOperation');
    cy.wait('@allFinished');

    cy.get('.sidebar-finished > .c-sidebar-nav-link').click({ force: true });
    cy.contains('New planned operation with custom type')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('some description');
        cy.get('td').eq(2).contains('done');
        cy.get('td').eq(4).contains('custom');
      })
  })

  it('Delete Operation ', () => {
    cy.server()
    cy.route('DELETE', '/operation/**').as('deleteOperation');

    cy.location('pathname').should('eq','/panel');
    cy.get('.c-sidebar-nav-dropdown-toggle',{timeout:6000}).click({ force: true });
    cy.get('.sidebar-planned > .c-sidebar-nav-link').click({ force: true });
    cy.contains('New planned operation with analysis type')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('some description')
        cy.get('td').contains('analysis')
        cy.get('td').get(`[title="Delete"]`).click({force: true});
      })
    cy.get('#deleteYes').click({force: true});
    cy.wait('@deleteOperation');
  })

  it('Add Plan', () => {
    cy.server()
    cy.route('POST', '/plan').as('addPlan');

    cy.location('pathname').should('eq','/panel')
    cy.get('.sidebar-plans > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.get('#addPlan').click({ force: true })
    cy.get('#title').type('Summer plan',{ force: true })
    cy.get('#description').type('some description',{ force: true })
    const targetDate = dayjs().format('YYYY-MM-DD')
    cy.get(':nth-child(3) > :nth-child(1) > .DayPickerInput > input').clear({ force: true })
      .should('have.value', '')
      .type(`${targetDate}{enter}`)
    cy.get(':nth-child(4) > :nth-child(1) > .DayPickerInput > input').clear({ force: true })
      .should('have.value', '').type(`${targetDate}{enter}`)
    cy.get('#submit').click({force:true})
    cy.wait('@addPlan');

    cy.contains('td','Summer plan').siblings()
      .within(() => {
        cy.contains('some description')
        cy.contains(dayjs().format('YYYY-MM-DD'))
        cy.contains(dayjs().format('YYYY-MM-DD'))
      })
  })

  it('Edit Plan', () => {
    cy.route('PUT', '/plan/**').as('editPlan');
    cy.server()

    cy.location('pathname').should('eq','/panel')
    cy.get('.sidebar-plans > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.contains('td','Late Winter to Spring').siblings()
      .within(() => {
        cy.contains('Regular inspection tasks to be repeated every 10 days.')
        cy.contains(dayjs().format('2021-02-10'))
        cy.contains(dayjs().format('2021-04-24'))
        cy.get('[title="Update"]').click({ force: true });
      })
    cy.get('#title').should('have.value','Late Winter to Spring')
      .clear({ force: true })
      .should('have.value', '')
    cy.get('#title').type('Autumn Buildup',{ force: true })
    cy.get('#description').should('have.value','Regular inspection tasks to be repeated every 10 days.')
      .clear({ force: true })
      .should('have.value', '')
    cy.get('#description').type('Keep apiaries tidy.',{ force: true })
    cy.get('#submit').click({ force: true })
    cy.wait('@editPlan');

    cy.contains('td','Autumn Buildup').siblings()
      .within(() => {
        cy.contains('Keep apiaries tidy.')
        cy.contains(dayjs().format('2021-02-10'))
        cy.contains(dayjs().format('2021-04-24'))
      })
  })

  it('Delete Plan ', () => {
    cy.server()
    cy.route('DELETE', '/plan/**').as('deletePlan');

    cy.location('pathname').should('eq','/panel')
    cy.get('.sidebar-plans > .c-sidebar-nav-link',{timeout:6000}).click({ force: true }),
    cy.contains('td','Late Spring to Late Summer')
      .siblings()
      .within(() => {
        cy.contains('Regular inspection tasks to be repeated every 3-4 weeks.')
        cy.contains(dayjs().format('2021-04-25'))
        cy.contains(dayjs().format('2021-09-11'))
        cy.get('[title="Delete"]').click({force: true});
      })
    cy.get('#deleteYes').click({force: true});
    cy.wait('@deletePlan');

    cy.contains('Late Spring to Late Summer').should('not.exist');
  })
})
