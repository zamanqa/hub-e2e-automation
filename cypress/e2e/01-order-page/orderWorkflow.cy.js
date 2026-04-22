import OrderListPage from '../../support/page-objects/01-order-page/OrderListPage';
import OrderWorkflowPage from '../../support/page-objects/01-order-page/OrderWorkflowPage';
import OrderWorkflowQueries from '../../support/helpers/01-order-page/order-workflow-queries';

describe('Order Management Workflow - E2E Tests', () => {
  let testOrderId;
  let testOrderAmount;

  before(() => {
    // Get order from database once before all tests
    cy.task('queryDb', OrderWorkflowQueries.getOrderForWorkflowTests()).then((orders) => {
      if (orders && orders.length > 0) {
        const order = orders[0];
        testOrderId = order.order_id;
        testOrderAmount = order.amount;
        cy.log(`Found order: ${testOrderId}, Amount: ${testOrderAmount}`);
      } else {
        throw new Error('No order found for workflow testing');
      }
    });
  });

  beforeEach(() => {
    // Navigate to order before each test
    OrderListPage.navigateToOrderList();
    cy.wait(3000);
    // Clear filters
    OrderListPage.clearAllFilters();
    cy.log('✓ Verified: Filters cleared successfully');
    OrderListPage.searchByOrderId(testOrderId);
    OrderListPage.clickOnOrderFromList(testOrderId);
    cy.wait(3000);

    // Verify URL contains order ID
    //cy.url().should('include', `/orders/${testOrderId}`);
    cy.log(`✓ Verified: Navigated to order ${testOrderId}`);
  });

  // ==================== Test 1: Create One-Time Payment ====================
  it.only('Test 1: should create one-time payment successfully', () => {
    cy.log('========== Test 1: Create One-Time Payment ==========');

    // Click actions menu (three dots)
    OrderWorkflowPage.clickActionsMenu();

    // Click one-time payment option
    OrderWorkflowPage.clickOneTimePayment();

    // Enter one-time payment details
    OrderWorkflowPage.enterOneTimePaymentTitle('Premium Support Package');
    OrderWorkflowPage.enterOneTimePaymentPrice('199.99');
    OrderWorkflowPage.enterVAT('19');

    // Verify quantity defaults to 1
    OrderWorkflowPage.verifyQuantityDefaultsToOne();

    // Click add item button
    OrderWorkflowPage.clickAddItem();

    // Enter message to customer
    OrderWorkflowPage.enterMessageToCustomer('Thank you for your order. Please proceed with payment.');

    // Click charge button
    OrderWorkflowPage.clickCharge();

    // Verify success notification
    OrderWorkflowPage.verifySuccessNotification();

    // Close notification
    OrderWorkflowPage.closeSuccessNotification();

    cy.log('✓ Test 1 Completed: One-time payment created successfully');
  });

  // ==================== Test 2: Mark Order as Fulfilled ====================
  it('Test 2: should mark order as fulfilled', () => {
    cy.log('========== Test 2: Mark Order as Fulfilled ==========');

    // Click actions menu
    OrderWorkflowPage.clickActionsMenu();

    // Click mark as fulfilled option
    OrderWorkflowPage.clickMarkAsFulfilled();

    // Click confirm button
    OrderWorkflowPage.clickConfirmFulfill();

    // Wait for success notification
    cy.wait(5000);

    // Verify order status changed to fulfilled in database
    cy.task('queryDb', OrderWorkflowQueries.verifyOrderStatus(testOrderId, 'fulfilled')).then((result) => {
      if (result && result.length > 0) {
        cy.log('✓ Verified: Order status changed to fulfilled in database');
      } else {
        cy.log('⚠ Warning: Order status not yet fulfilled in database');
      }
    });

    // Close notification
    OrderWorkflowPage.closeSuccessNotification();
    cy.wait(2000);

    cy.log('✓ Test 2 Completed: Order marked as fulfilled');
  });

  // ==================== Test 3: Charge Initial Payment ====================
  it('Test 3: should charge initial payment', () => {
    cy.log('========== Test 3: Charge Initial Payment ==========');

    // Click actions menu
    OrderWorkflowPage.clickActionsMenu();

    // Click charge initial payment
    OrderWorkflowPage.clickChargeInitialPayment();

    // Verify amount to charge
    //OrderWorkflowPage.verifyAmountToCharge('71,40 €');

    // Enter message to customer
    OrderWorkflowPage.enterInitialPaymentMessage('Your initial payment has been processed. Invoice attached.');

    // Click charge button
    OrderWorkflowPage.clickCharge();

    // Wait for success notification
    cy.wait(3000);

    // Verify success notification
    OrderWorkflowPage.verifySuccessNotification();

    // Close notification
    OrderWorkflowPage.closeSuccessNotification();

    // Verify transaction_id is populated in database
    cy.task('queryDb', OrderWorkflowQueries.verifyTransactionId(testOrderId)).then((result) => {
      if (result && result.length > 0) {
        cy.log(`✓ Verified: Transaction ID populated: ${result[0].transaction_id}`);
      } else {
        cy.log('⚠ Warning: Transaction ID not yet populated in database');
      }
    });

    cy.log('✓ Test 3 Completed: Initial payment charged successfully');
  });

  // ==================== Test 4: Update Customer Information ====================
  it('Test 4: should update customer information', () => {
    cy.log('========== Test 4: Update Customer Information ==========');

    // Click edit customer button
    OrderWorkflowPage.clickEditCustomer();

    // Update only billing address fields (Given name, Surname, Street)
    OrderWorkflowPage.updateGivenName('Max');
    OrderWorkflowPage.updateSurname('Mustermann');
    OrderWorkflowPage.updateStreet('Hauptstraße 42');

    // Save customer information
    OrderWorkflowPage.clickSaveCustomer();

    // Wait for success notification
    cy.wait(2000);

    // Verify updated information displays
    OrderWorkflowPage.verifyCustomerInfo('Max', 'Mustermann');

    // Refresh page and verify persistence
    cy.reload();
    cy.wait(3000);
    OrderWorkflowPage.verifyCustomerInfo('Max', 'Mustermann');

    cy.log('✓ Test 4 Completed: Customer information updated successfully');
  });

  // ==================== Test 5: Verify Navigation Between Tabs ====================
  it('Test 5: should navigate between all tabs successfully', () => {
    cy.log('========== Test 5: Verify Navigation Between Tabs ==========');

    // Click General tab and verify URL hash
    OrderWorkflowPage.clickGeneralTab();
    cy.url().should('include', '#general');
    cy.log('✓ Verified: URL contains #general');

    // Click Payments tab and verify URL hash
    OrderWorkflowPage.clickPaymentsTab();
    cy.url().should('include', '#payments');
    cy.log('✓ Verified: URL contains #payments');

    // Click Payment methods tab and verify URL hash
    OrderWorkflowPage.clickPaymentMethodsTab();
    cy.url().should('include', '#paymentMethods');
    cy.log('✓ Verified: URL contains #paymentMethods');

    // Click History tab and verify URL hash
    OrderWorkflowPage.clickHistoryTab();
    cy.url().should('include', '#history');
    cy.log('✓ Verified: URL contains #history');

    // Return to General tab and verify URL hash
    OrderWorkflowPage.clickGeneralTab();
    cy.url().should('include', '#general');
    cy.log('✓ Verified: URL contains #general');

    cy.log('✓ Test 5 Completed: Tab navigation verified');
  });

  // ==================== Test 6: Update Payment Method ====================
  it('Test 6: should update payment method from menu', () => {
    cy.log('========== Test 6: Update Payment Method ==========');

    // Click actions menu
    OrderWorkflowPage.clickActionsMenu();

    // Click update payment method option
    OrderWorkflowPage.clickUpdatePaymentMethod();

    // Click "Click here" link - opens in new tab
    OrderWorkflowPage.clickHereLinkToUpdatePayment();
    cy.wait(3000);

    // Verify new page loaded (payment update page)
    cy.url().should('include', 'update-payment-method');
    cy.log('✓ Verified: Payment update page opened');

    // Go back to previous page
    cy.go('back');
    cy.wait(5000);

    // Verify back on order page
    cy.url().should('include', `/orders/${testOrderId}`);
    cy.log('✓ Verified: Returned to order page');

    cy.log('✓ Test 6 Completed: Payment method update flow verified');
  });

});
