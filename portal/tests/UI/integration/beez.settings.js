const login = () => {
  cy.server()
  cy.route('POST', '/login').as('loginUser');
  cy.route('POST', '/get/verified').as('verifyUser');
  cy.route('GET', '/api/translations/**').as('translations');
  cy.visit('/')
  cy.title().should('eq','bee•z link')
  cy.wait('@translations', { timeout: 30000 });
  cy.get('.navBarLogin',{ timeout: 30000 }).click()
  cy.fixture('admin').then(adminJson => {
    cy.get('#inputEmail').should('be.enabled').type(adminJson.name, { force: true })
    cy.get('#inputPassword').should('be.enabled').type(adminJson.password, { force: true })
  })
  cy.get('form .btn-login').click();
  cy.wait('@loginUser')
  cy.wait('@verifyUser')
  cy.wait('@verifyUser')
}

describe('Test Users and System', () => {

  beforeEach(() => {
    login();
    Cypress.Cookies.preserveOnce('session_id', 'remember_token');
  });

  it('Add User', () => {
    cy.route('POST', '/add-user').as('addUser');
    cy.route('POST', '/upload-image/**').as('uploadImage');
    cy.route('GET', '/all-users').as('allUsers');

    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-user-management > .c-sidebar-nav-link',{timeout:6000}).click({force:true})
    cy.get('#addUser').click({force:true})
    cy.fixture('user').then(userJson => {
      cy.get('#name').type(userJson.add_user_name)
      cy.get('#address').type(userJson.add_user_address)
      cy.get('#email').type(userJson.add_user_email)
      cy.get('#password').type(userJson.add_user_password)
      cy.chooseReactSelectOption('#role','regular','Regular');
      cy.get('#submit').click({force:true});
      cy.wait('@addUser')
      cy.wait('@allUsers',{timeout:6000})
      cy.contains(userJson.add_user_name);
    })
  })

  it('Edit User', () => {
    cy.route('PUT', '/update-user/**').as('updateUser');
    cy.route('POST', '/upload-image/**').as('uploadImage');
    cy.route('GET', '/all-users').as('allUsers');

    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-user-management > .c-sidebar-nav-link',{timeout:6000}).click({force:true})
    cy.wait('@allUsers')
    cy.fixture('user').then(userJson => {
      cy.contains(userJson.user2)
        .parent('td')
        .parent('tr')
        .within(() => {
          cy.get('td').get('[title="Update"]').click({force: true});
        })
      cy.get('#name').should('have.value', userJson.user2)
        .clear()
        .should('have.value', '')
      cy.get('#name').type(userJson.user2_edited)

      cy.get('#email').should('have.value',  userJson.email2)
        .clear()
        .should('have.value', '')
      cy.get('#email').type(userJson.email2_edited)

      cy.chooseReactSelectOption('#role','admin','Admin');
      cy.get('#submit').click({force:true})
      cy.wait('@updateUser')
      cy.contains(userJson.user2_edited)
    })

  })

  it('Delete User ', () => {
    cy.route('DELETE', '/user/**').as('deleteUser');
    cy.route('GET', '/all-users').as('allUsers');

    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-user-management > .c-sidebar-nav-link',{timeout: 6000}).click()
    cy.wait('@allUsers')
    cy.fixture('user').then(userJson => {
      cy.contains(userJson.user3)
        .parent('td')
        .parent('tr')
        .within(() => {
          cy.get('td').get('[title="Delete"]').click({force: true});
        })
      cy.get('#deleteYes').click({force: true});
      cy.wait('@deleteUser');

      cy.contains(userJson.user3)
        .parent('td')
        .parent('tr')
        .within(() => {
          cy.get('td').contains('Inactive');
        })
    })
  })

  it('Add System', () => {
    cy.server()
    cy.route('GET', '/settings').as('allSettings');
    cy.route('GET', '/all-users').as('allUsers');
    cy.route('POST', '/settings').as('addSettings');

    cy.location('pathname').should('eq','/panel')
    cy.get('.sidebar-system-settings > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.wait('@allSettings')
    cy.wait('@allUsers')
    cy.get('#createSettings').click({ force: true});
    cy.get('#key').type('ui.slider.show',{ force: true })
    cy.get('#value').type('true',{ force: true })
    cy.chooseReactSelectOption('#scope','Benutzer C','Benutzer C');
    cy.get('[title="Create"]').click({ force: true })
    cy.wait('@addSettings');

    cy.contains('ui.slider.show')
      .parent('td')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('true')
        cy.get('td').contains('Benutzer C')
      })
  })

  it('Edit Setting', () => {
    cy.server()
    cy.route('GET', '/settings').as('allSettings');
    cy.route('GET', '/all-users').as('allUsers');
    cy.route('PUT', '/settings/**').as('editSetting');

    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-system-settings > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.wait('@allSettings')
    cy.wait('@allUsers')
    cy.contains('ui.sidebar.show_components')
      .parent('td')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('false')
        cy.get('td').contains('System')
        cy.get('td').get('[title="Update"]').click({ force: true });
        cy.chooseReactSelectOption('#scope','Marko Ristić','Marko Ristić');
        cy.get('#value').should('have.value', '0')
          .clear({ force: true })
          .should('have.value', '')
        cy.get('#value').type('true',{ force: true })
        cy.get('td').get('[title="Create"]').click({ force: true });
      })

    cy.wait('@editSetting');

    cy.contains('ui.sidebar.show_components')
      .parent('td')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('true')
        cy.get('td').contains('Marko Ristić')
      })
  })

  it('Delete Setting ', () => {
    cy.server()
    cy.route('GET', '/settings').as('allSettings');
    cy.route('GET', '/all-users').as('allUsers');
    cy.route('DELETE', '/settings/**').as('deleteSetting');

    cy.location('pathname').should('eq','/panel')
    cy.get('.c-sidebar-nav > .sidebar-system-settings > .c-sidebar-nav-link',{timeout:6000}).click({ force: true })
    cy.wait('@allSettings')
    cy.wait('@allUsers')

    cy.contains('ui.sidebar.show_dashboard')
      .parent('td')
      .parent('tr')
      .within(() => {
        cy.get('td').contains('false')
        cy.get('td').contains('System')
        cy.get('td').get('[title="Delete"]').click({force: true});
      })
    cy.get('#deleteYes').click({force: true});
    cy.wait('@deleteSetting');

    cy.contains('ui.sidebar.show_dashboard').should('not.exist');
  })
})

describe('Test User', () => {
  beforeEach(() => {
    cy.login();
    Cypress.Cookies.preserveOnce('session_id', 'remember_token');
  });

  it('Change password', () => {
    cy.route('POST', '/change-password').as('changePassword');
    cy.get('.sidebar-user-settings > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#changePassword').click({force: true})
    cy.fixture('user').then(userJson => {
      cy.get('#current_password').type(userJson.password)
      cy.get('#new_password').type(userJson.password)
      cy.get('#new_confirm_password').type(userJson.password)
    })
    cy.get('#submit').click({force: true})
    cy.wait('@changePassword')
    cy.get('.toast-body').contains('Your password is changed successfully');
  })

  it('Edit User', () => {
    cy.route('PUT', '/update-user/**').as('updateUser');

    cy.location('pathname').should('eq', '/panel')
    cy.get('.sidebar-user-settings > .c-sidebar-nav-link',{timeout:6000}).click({force: true})
    cy.get('#editProfile').click({force: true})

    cy.fixture('user').then(userJson => {
      cy.get('#name').clear({force: true})
        .should('have.value', '')
      cy.get('#name').type(userJson.name_edited)

      cy.get('#address').clear({force: true})
        .should('have.value', '')
      cy.get('#address').type(userJson.address_edited)

      cy.get('#submit').click({force: true})
      cy.wait('@updateUser')
      cy.get('.toast-body').contains('You are successfully updated your settings');
      cy.get('#name').should('have.value', userJson.name_edited)
      cy.get('#address').should('have.value', userJson.address_edited)
    })
  })
})
