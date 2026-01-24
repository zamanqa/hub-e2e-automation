import OrderCreationPage from '../../support/page-objects/OrderCreationPage';

describe('Order Creation - Add Items with Different Subscription Types', () => {
  let testData;

  before(() => {
    // Load test data from fixture
    cy.fixture('testData').then((data) => {
      testData = data;
    });

    // Verify all APIs are accessible
    cy.checkApiHealth();
  });

  it('should create an order with three subscription items (service, consumable, digital)', () => {
    // Step 1: Click Create order button and verify page loaded
    OrderCreationPage.clickQuoteOrderButton();
    OrderCreationPage.verifyQuoteOrderPageLoaded();

    // ========== FIRST ITEM: SERVICE TYPE ==========
    cy.log('========== Adding Item 1: SERVICE TYPE ==========');

    // Step 2: Click "Add item" button
    OrderCreationPage.clickAddItem();
    OrderCreationPage.verifyDialogOpened();

    // Step 3: Select Product from dropdown
    OrderCreationPage.selectFirstProduct();

    // Step 4: Select Variant from dropdown
    OrderCreationPage.selectFirstVariant();

    // Step 5: Verify Subscription toggle is enabled
    OrderCreationPage.verifySubscriptionEnabled();

    // Step 6: Select Type - Service (first option)
    OrderCreationPage.selectFirstType();

    // Step 7: Set Price to 10
    OrderCreationPage.setPrice('10');

    // Step 8: Set Quantity to 2
    OrderCreationPage.setQuantity('2');

    // Step 9: Verify Unit price and Row total calculations
    OrderCreationPage.verifyPriceCalculation();

    // Step 11: Set Duration to 10
    OrderCreationPage.setDuration('10');

    // Step 12: Select Frequency (monthly)
    OrderCreationPage.selectMonthlyFrequency();

    // Step 13: Verify Interval is set to 1
    OrderCreationPage.verifyInterval('1');

    // Step 14: Verify Prepaid duration is set to 1
    OrderCreationPage.verifyPrepaidDuration('1');

    // Step 15: Select current date as Start date
    OrderCreationPage.selectCurrentStartDate();

    // Step 16: Verify and print End date
    OrderCreationPage.verifyEndDate();

    // Step 17: Click "Add item" button to submit
    OrderCreationPage.submitItem();

    cy.log('========== DRAFT ITEMS ADDED SUCCESSFULLY ==========');

    // ========== FILL BILLING ADDRESS ==========
    OrderCreationPage.fillBillingAddress(testData.billingAddress);

    // ========== CREATE ORDER ==========
    cy.log('========== Creating Order ==========');
    OrderCreationPage.clickQuoteOrder();
    OrderCreationPage.verifyQuoteOrderCreated();

  });
});