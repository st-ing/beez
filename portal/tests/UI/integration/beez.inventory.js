describe('Test Apiaries and Beehives', () => {
  beforeEach(() => {
    cy.login();
    Cypress.Cookies.preserveOnce('session_id', 'remember_token');
  });

  it('Add Apiary', () => {
    cy.server();
    cy.route('POST', '/api/apiary').as('addApiary');

    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-apiaries > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.get('#addNew').contains('Add new').click({ force: true })
    cy.get('#name').type('Pcelinjak1')
    cy.get('#address').type('Jorgovana')
    cy.get('#altitude').type('105')
    cy.get('#description').type('dobar pcelinjak')
    cy.get('#flora_type').type('Warre')
    cy.chooseReactSelectOption('#type_of_env','Urban','Urban');
    cy.chooseReactSelectOption('#sun_exposure','Medium','Medium');
    cy.get('[name=migrate]').check({force: true}).should('be.checked')
    cy.get('.leaflet-draw-draw-polygon').click({ force: true });
    cy.get('.leaflet-container')
      .click(80,10)
      .click(80,200)
      .click(150,200)
      .click(150,10)
      .click(80,10);
    cy.get('#submit').click({force: true})
    cy.wait('@addApiary')

    cy.contains('Pcelinjak1')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('dobar pcelinjak')
        cy.get('td').contains('Medium')
      })
  })

  it('Edit Apiary', () => {
    cy.server();
    cy.route('PUT', '/api/apiary/**').as('editApiary');
    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-apiaries > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.contains('Apiary A.3')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('4085 Diamond Street, Waynesville, NC')
        cy.get('td').get('[title=Update]').click({ force: true });
      })
    cy.get('#name').should('have.value', 'Apiary A.3')
      .clear()
      .should('have.value', '')
    cy.get('#name').type('Apiary A.4')
    cy.get('#address').should('have.value', '4085 Diamond Street, Waynesville, NC')
      .clear()
      .should('have.value', '')
    cy.get('#address').type('Diamond Street')
    cy.chooseReactSelectOption('#type_of_env','Urban','Urban');
    cy.get('[name=migrate]').should('be.checked')
    cy.get('#submit').click({force: true})
    cy.wait('@editApiary')

    cy.contains('Apiary A.4')
    cy.contains('Diamond Street')
    cy.contains('Urban')
  })

  it('Delete Apiary ', () => {
    cy.server();
    cy.route('DELETE', '/api/apiary/**').as('deleteApiary');
    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-apiaries > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.contains('Apiary A.2')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Medium')
        cy.get('td').contains('Urban')
        cy.get('td').get('[title=Delete]').click({ force: true });
      })
    cy.get('#deleteYes').click({force: true});
    cy.wait('@deleteApiary');
    cy.contains('Apiary A.2').should('not.exist');
  })

  it('Check apiary operations ', () => {
    cy.server();
    cy.route('GET', '/api/apiary/**').as('getApiary');
    cy.route('GET', 'api/apiary/operations/**').as('getOperations');
    cy.route('GET', '/plan').as('allPlans');
    cy.route('GET','/api/apiary-beehives/**').as('allHistory');
    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-apiaries > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.contains('Apiary A.1')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Medium')
        cy.get('td').contains('Urban')
        cy.get('td').get('[title="Detailed view"]').click({ force: true });
      })
    cy.wait('@getApiary');
    cy.wait('@getOperations');
    cy.wait('@allPlans');
    cy.wait('@allHistory');
    cy.get('.table.table-sm > tbody').find('tr').its('length').should('be.gt', 1);
  })

  it('Add Beehive', () => {
    cy.server()
    cy.route('POST', '/api/beehive').as('addBeehive');

    cy.location('pathname').should('eq','/panel')
    cy.wait(6000);
    cy.get('.c-sidebar-nav > .sidebar-beehives > .c-sidebar-nav-link').click({ force: true })
    cy.wait(6000)
    cy.get('#addNew').click({ force: true ,timeout:6000})
    cy.chooseReactSelectOption('#apiary_id','A.4','Apiary A.4');
    cy.get('#name').type('Beehive1')
    cy.get('#longitude').clear().type(55)
    cy.get('#latitude').clear().type(66)
    cy.get('#altitude').clear().type(100)
    cy.get('#type').type('Warre');
    cy.get('#num_honey_frames').clear().type(1);
    cy.get('#num_pollen_frames').clear().type(2);
    cy.get('#num_brood_frames').clear().type(3);
    cy.get('#num_empty_frames').clear().type(4);
    cy.get('#source_of_swarm').type('Apple')
    cy.get('input[type=color]').invoke('val', '#aaaaaa').trigger('change');
    cy.get('.DayPickerInput > input').click({force:true})
    cy.get('#submit').click({force: true})
    cy.wait('@addBeehive');
  })

  it('Edit Beehive', () => {
    cy.server()
    cy.route('PUT', '/api/beehive/**').as('editBeehive');
    cy.get('.sidebar-beehives > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.contains('BeeHive A.4.1')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Warré ');
        cy.get('td').get('[title="Update"]').click({ force: true });
      })
    cy.get('#name').should('have.value', 'BeeHive A.4.1')
      .clear()
      .should('have.value', '')
    cy.get('#name').type('Kosnica A.1.4')
    cy.chooseReactSelectOption('#apiary_id','A.1','Apiary A.1');
    cy.get('#type').should('have.value', 'Warré ')
      .clear()
      .should('have.value', '')
    cy.get('#type').type('Ware')
    cy.get('#longitude').should('have.value','-83.006830')
    cy.get('#latitude').should('have.value', '35.498449')
    cy.get('#num_honey_frames').should('have.value', 2);
    cy.get('#num_pollen_frames').should('have.value', 1);
    cy.get('#num_brood_frames').should('have.value', 2);
    cy.get('#num_empty_frames').should('have.value', 1);
    cy.get('#source_of_swarm').should('have.value', 'bought');
    cy.get('.DayPickerInput > input').should('have.value','2001-02-28');
    cy.get('#submit').click({force: true})
    cy.wait('@editBeehive');

    cy.contains('Kosnica A.1.4')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Ware');
      })
  })

  it('Delete Beehive ', () => {
    cy.server()
    cy.route('DELETE', '/api/beehive/**').as('deleteBeehive');
    cy.wait(6000);
    cy.get('.sidebar-beehives > .c-sidebar-nav-link').click({ force: true })
    cy.contains('BeeHive A.4.2')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('Warré');
        cy.get('td').get('[title="Delete"]').click({ force: true });
      })
    cy.get('#deleteYes').click({force: true});
    cy.wait('@deleteBeehive',{ timeout: 10000 });

    cy.contains('BeeHive A.4.2').should('not.exist');
  })

})
