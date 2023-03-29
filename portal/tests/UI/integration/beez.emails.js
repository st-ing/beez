describe('Test emails', () => {
  it('Send mail to change password', () => {
    cy.server();
    cy.route('POST', '/password/reset').as('passwordReset');
    cy.route('GET', '/api/translations/**').as('translations');
    cy.route('POST', '/password/email').as('sendPasswordEmail');
    cy.route('POST', '/login').as('loginUser');
    cy.route('POST', '/get/verified').as('verifyUser');
    cy.route('GET', '/all-users').as('allUsers');

    cy.visit('/')
    cy.title().should('eq','bee•z link')
    cy.wait('@translations', { timeout: 55000 });
    cy.get('.navBarLogin',{ timeout: 55000 }).click({ force: true })
    cy.fixture('admin').then(adminJson => {
      cy.get('#inputEmail').should('be.enabled').type(adminJson.name, { force: true })
      cy.get('#inputPassword').should('be.enabled').type(adminJson.password, { force: true })
    })
    cy.get('form .btn-login').click();
    cy.wait('@loginUser', { timeout: 10000})
    cy.wait('@verifyUser', { timeout: 10000})
    cy.wait('@verifyUser', { timeout: 10000})

    cy.get('.c-sidebar-nav > .sidebar-user-management > .c-sidebar-nav-link').click({ force: true });
    cy.wait('@allUsers', { timeout: 10000})
    cy.get(':nth-child(1) > :nth-child(5) > button[aria-label="Update user"]').click({ force: true });
    cy.get('button[aria-label="Reset password"]').click({ force: true });
    cy.wait('@sendPasswordEmail', { timeout: 45000});
    cy.fixture('user').then(userJson => {
      cy.get('.toast-body').contains(userJson.name);
    })
    cy.wait(3000);
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.request({
      method:'GET',
      url:Cypress.env('mailhog_url')+'/api/v2/messages',
      auth: {
        username: Cypress.env('mailhog_username'),
        password: Cypress.env('mailhog_password'),
      }
    }).then((response) => {
      expect(response).to.have.property('status',200);
      expect(response.body).to.not.be.null;
      cy.fixture('user').then(userJson => {
        expect(response.body.items[0].Content.Headers.To[0]).to.be.equal(userJson.name);
      })
      let rawMailText = response.body.items[0].Raw.Data;
      rawMailText= rawMailText.replace(/=\r\n/g, "");
      rawMailText= rawMailText.replace(/=3D/g, "=");
      var expression = /(http[s]?:\/\/[^\s]+change[^\s]{2,})/g;
      let link = rawMailText.match(expression)[0];
      cy.visit(link, { timeout: 55000 });
      cy.fixture('user').then(userJson => {
        cy.get('#password',{ timeout: 55000 }).type(userJson.password, {force: true});
      })
      cy.get("form .btn-recovery").click({ force: true });
      cy.wait('@passwordReset');
      cy.get('.success-block').contains('You successfuly changed password');
    })
  })

  it('User registration + check if verification mail sent', () => {
    cy.server();
    cy.route('POST', '/register').as('registerUser');
    cy.route('GET', '/api/translations/**').as('translations');

    cy.visit('/')
    cy.title().should('eq','bee•z link')
    cy.wait('@translations', { timeout: 55000 });
    cy.get('.navBarLogin',{ timeout: 55000 }).click({ force: true });
    cy.get('.div-regular .p-small').click({ force: true });
    cy.fixture('register').then(registerJson => {
      cy.get('#email').type(registerJson.email4,{force: true});
      cy.get('#name').type(registerJson.name4,{force: true});
      cy.get('#password').type(registerJson.password4,{force: true});
    })
    cy.get('[type=submit]').click({force: true});
    cy.wait('@registerUser')
    cy.get('.success-block').contains('You successfuly registered, please verify email to continue');

    cy.wait(3000);

    // interaction with MailHog
    cy.request({
      method:'GET',
      url:Cypress.env('mailhog_url')+'/api/v2/messages',
      auth: {
        username: Cypress.env('mailhog_username'),
        password: Cypress.env('mailhog_password'),
      }
    }).then((response) => {
      expect(response).to.have.property('status',200);
      expect(response.body).to.not.be.null;
      // checking email
      cy.fixture('register').then(registerJson => {
        expect(response.body.items[0].Content.Headers.To[0]).to.be.equal(registerJson.email4)
      });
    })
  })

  //it('User registration (with sending verification mail) + Trying login with not verifed email',() => {

  it('User registration + Clicking verification link + Trying login with account verifed',() => {
    cy.server();
    cy.route('GET', '/api/translations/**').as('translations');
    cy.route('POST', '/get/verified').as('verifyUser');
    cy.route('POST', '/login').as('loginUser');
    cy.route('POST', '/register').as('registerUser');

    // registration
    cy.visit('/');
    cy.title().should('eq', 'bee•z link');
    cy.wait('@translations', {timeout: 30000});
    cy.get('.navBarLogin', {timeout: 30000}).click({force: true})
    cy.get('.div-regular > .p-small', {timeout: 30000}).click({force: true})
    cy.fixture('register').then(registerJson => {
      cy.get('#email').should('be.enabled').type(registerJson.email3, {force: true})
      cy.get('#name').should('be.enabled').type(registerJson.name3, {force: true})
      cy.get('#password').should('be.enabled').type(registerJson.password3, {force: true})
    })
    cy.get('div.text-center > .btn').click({force: true});
    cy.wait('@registerUser')
    cy.contains('You successfuly registered, please verify email to continue')

    cy.wait(3000);

    var verificationLink;

    // getting verification link - interaction with MailHog
    cy.request({
      method: 'GET',
      url: Cypress.env('mailhog_url') + '/api/v2/messages',
      auth: {
        username: Cypress.env('mailhog_username'),
        password: Cypress.env('mailhog_password'),
      }
    }).then((response) => {
      expect(response).to.have.property('status', 200);
      expect(response.body).to.not.be.null;

      // parsing verification link
      let rawMailText = response.body.items[0].Raw.Data;
      cy.log(rawMailText)
      rawMailText= rawMailText.replace(/=\r\n/g, "");
      rawMailText= rawMailText.replace(/=3D/g, "=");
      var expression = /(http[s]?:\/\/[^\s]+verify[^\s]{2,})/g;
      verificationLink = rawMailText.match(expression)[0];

      // clicking verification link
      //cy.clearCookies();
      //cy.clearLocalStorage();
      cy.log(verificationLink);
      cy.visit(verificationLink, {timeout: 55000}).screenshot();

      // loging in
      // maybe cy.visit('/'); instead of waiting for redirect from above command
      cy.wait('@translations', {timeout: 30000})
      cy.screenshot();
      cy.get('.navBarLogin', {timeout: 30000}).click({force: true});
      cy.fixture('register').then(registerJson => {
        cy.get('#inputEmail').should('be.enabled').type(registerJson.email3, {force: true})
        cy.get('#inputPassword').should('be.enabled').type(registerJson.password3, {force: true})
      })
      cy.get('form .btn-login').click({force: true});
      cy.wait('@loginUser', {timeout: 10000})
      cy.wait('@verifyUser', {timeout: 10000})
      cy.wait('@verifyUser', {timeout: 10000})
      cy.location('pathname').should('eq', '/panel')
    })
  })

  it('Forgot password email', () => {
    cy.server();
    cy.route('POST', '/password/reset').as('passwordReset');
    cy.route('POST', '/password/email').as('sendPasswordEmail');
    cy.route('GET', '/api/translations/**').as('translations');
    cy.route('POST', '/get/verified').as('verifyUser');

    cy.visit('/');
    cy.title().should('eq','bee•z link');
    cy.wait('@translations', { timeout: 55000 });
    cy.get('.navBarLogin',{ timeout: 55000 }).click({ force: true });
    cy.get('#forget-password').click({ force: true });
    cy.fixture('user').then(userJson => {
      cy.get('#email').type(userJson.email3, {force: true});
    })
    cy.get('[type=submit]').click();
    cy.wait('@sendPasswordEmail',{ timeout: 45000});
    cy.get('.success-block').contains('We have emailed your password reset link!');
    cy.wait(5000);
    cy.request({
      method:'GET',
      url:Cypress.env('mailhog_url')+'/api/v2/messages',
      auth: {
        username: Cypress.env('mailhog_username'),
        password: Cypress.env('mailhog_password'),
      }
    }).then((response) => {
      expect(response).to.have.property('status',200);
      expect(response.body).to.not.be.null;
      cy.log(response.body)
      cy.fixture('user').then(userJson => {
        expect(response.body.items[0].Content.Headers.To[0]).to.be.equal(userJson.email3);
      })
      let rawMailText = response.body.items[0].Raw.Data;
      rawMailText= rawMailText.replace(/=\r\n/g, "");
      rawMailText= rawMailText.replace(/=3D/g, "=");
      var expression = /(http[s]?:\/\/[^\s]+change[^\s]{2,})/g;
      let link = rawMailText.match(expression)[0];
      cy.visit(link, {timeout: 55000 });
      cy.wait('@translations', { timeout: 55000 });
      cy.get('#password',{ timeout: 55000 }).type('password',{ force: true });
      cy.get("form .btn-recovery").click({force: true});
      cy.wait('@passwordReset');
      cy.get('.success-block').contains('You successfuly changed password');
    })
  })

})
