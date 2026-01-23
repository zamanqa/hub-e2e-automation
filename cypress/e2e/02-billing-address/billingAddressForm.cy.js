import OrderCreationPage from '../../support/page-objects/OrderCreationPage';

describe('Billing Address Form - Customer Information', () => {
  let testData;

  before(() => {
    // Load test data from fixture
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  it('should successfully fill and validate billing address form', () => {
    cy.log('========== BILLING ADDRESS FORM TEST ==========');

    // Step 1: Navigate to Order Creation page
    OrderCreationPage.visit();
    OrderCreationPage.verifyPageLoaded();

    // Step 2: Add a single item to enable billing address section
    cy.log('========== Adding Item to Enable Billing Form ==========');
    OrderCreationPage.clickAddItem();
    OrderCreationPage.verifyDialogOpened();
    OrderCreationPage.selectFirstProduct();
    OrderCreationPage.selectFirstVariant();
    OrderCreationPage.verifySubscriptionEnabled();
    OrderCreationPage.selectFirstType();
    OrderCreationPage.setPrice('10');
    OrderCreationPage.setQuantity('1');
    OrderCreationPage.verifyPriceCalculation();
    OrderCreationPage.setDuration('10');
    OrderCreationPage.selectMonthlyFrequency();
    OrderCreationPage.verifyInterval('1');
    OrderCreationPage.verifyPrepaidDuration('1');
    OrderCreationPage.selectCurrentStartDate();
    OrderCreationPage.verifyEndDate();
    OrderCreationPage.submitItem();

    // Step 3: Fill billing address form with test data
    cy.log('========== Filling Billing Address ==========');
    OrderCreationPage.fillBillingAddress(testData.billingAddress);

    // Step 4: Verify all billing fields are filled correctly
    cy.log('========== Verifying Billing Address Fields ==========');

    OrderCreationPage.givenNameInput.should('have.value', testData.billingAddress.givenName);
    cy.log(`✓ Verified: Given name is "${testData.billingAddress.givenName}"`);

    OrderCreationPage.surnameInput.should('have.value', testData.billingAddress.surname);
    cy.log(`✓ Verified: Surname is "${testData.billingAddress.surname}"`);

    OrderCreationPage.phoneInput.should('have.value', testData.billingAddress.phone);
    cy.log(`✓ Verified: Phone is "${testData.billingAddress.phone}"`);

    OrderCreationPage.vatNumberInput.should('have.value', testData.billingAddress.vatNumber);
    cy.log(`✓ Verified: VAT number is "${testData.billingAddress.vatNumber}"`);

    OrderCreationPage.companyInput.should('have.value', testData.billingAddress.company);
    cy.log(`✓ Verified: Company is "${testData.billingAddress.company}"`);

    OrderCreationPage.streetInput.should('have.value', testData.billingAddress.street);
    cy.log(`✓ Verified: Street is "${testData.billingAddress.street}"`);

    OrderCreationPage.streetNumberInput.should('have.value', testData.billingAddress.streetNumber);
    cy.log(`✓ Verified: Street number is "${testData.billingAddress.streetNumber}"`);

    OrderCreationPage.postalCodeInput.should('have.value', testData.billingAddress.postalCode);
    cy.log(`✓ Verified: Postal code is "${testData.billingAddress.postalCode}"`);

    OrderCreationPage.cityInput.should('have.value', testData.billingAddress.city);
    cy.log(`✓ Verified: City is "${testData.billingAddress.city}"`);

    cy.log('========== BILLING ADDRESS FORM VALIDATION COMPLETED ==========');
  });
});
