// chargeback-test.cy.js

describe('Create Chargeback', () => {
  
  const MOLLIE_TEST_API_KEY = 'test_U7aHvEtJrHdsBPW5VV4AhQvKD2c8sz';
  const PAYMENT_ID = 'tr_DJ6ZLRqEbeJN8mzQCyTLJ';
  
  it('create chargeback for tr_DJ6ZLRqEbeJN8mzQCyTLJ', () => {
    
    cy.request({
      method: 'GET',
      url: `https://api.mollie.com/v2/payments/${PAYMENT_ID}`,
      headers: {
        'Authorization': `Bearer ${MOLLIE_TEST_API_KEY}`
      }
    }).then((response) => {
      const changeStateUrl = response.body._links.changePaymentState.href;
      
      cy.visit(changeStateUrl);
      cy.wait(3000);
      
      // Click on "Vollständige Rückbuchung anlegen"
      cy.contains('Vollständige Rückbuchung anlegen').click();
      cy.wait(2000);
      
      // Click on "Weiter" button
      cy.contains('Weiter').click();
      cy.wait(2000);
      
      // Verify text is available
      cy.contains('Hinweis: Dies ist eine Testzahlung.').should('be.visible');
      
      cy.log('Chargeback created');
    });
  });
});