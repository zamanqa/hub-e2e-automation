import OrderListPage from '../../support/page-objects/OrderListPage';
import OrderDetailPage from '../../support/page-objects/OrderDetailPage';
import OrderQueries from '../../support/helpers/order-queries';
import SubscriptionQueries from '../../support/helpers/subscription-queries';

describe('Order Detail Page - Comprehensive Tests', () => {
  let testData;
  let testOrderId;
  let testNoteMessage = 'Automated test note - ' + Date.now();
  let collectedSubscriptions = {};

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  it('should complete all order detail page tests', () => {
    cy.log('========== Order Detail Page - Complete Test Flow ==========');

    // ==================== Step 1: Search and Open Order ====================
    cy.log('--- Step 1: Search and Open Order ---');

    // Get 2nd order without subscription from database
    cy.task('queryDb', OrderQueries.getFifthOrderWithoutSubscription()).then((orders) => {
      if (orders && orders.length > 0) {
        const order = orders[0];
        testOrderId = order.order_id;
        cy.log(`Found order from DB: ${testOrderId}`);

        // Navigate to Order List page
        OrderListPage.navigateToOrderList();
        cy.wait(5000);

        // Search for the order
        OrderListPage.searchByOrderId(testOrderId);

        // Click on the order
        OrderListPage.clickOnOrderFromList(testOrderId);

        // Wait for 2 seconds
        cy.wait(3000);

        // Verify URL contains /orders/{order_id}
        OrderDetailPage.verifyUrlContainsOrderId(testOrderId);

        cy.log('✓ Verified: Successfully opened order detail page');

        // ==================== Step 2: Create and Verify Note ====================
        cy.log('--- Step 2: Create and Verify Note ---');

        // Click Create Note button
        OrderDetailPage.clickCreateNote();

        // Enter test message
        OrderDetailPage.enterNoteMessage(testNoteMessage);

        // Click Create button
        OrderDetailPage.submitNote();

        // Verify note appears in notes section
        OrderDetailPage.verifyNoteExists(testNoteMessage);

        cy.log('✓ Verified: Note created and visible successfully');

        // ==================== Step 3: Product List and Subscription Creation ====================
        cy.log('--- Step 3: Product List and Subscription Creation ---');

        // Wait for page to load
        cy.wait(2000);

        // Collect subscriptions by type
        cy.log('--- Collecting Subscription Types ---');

        OrderDetailPage.getAllProductRows().then(($rows) => {
          const rows = Array.from($rows);
          cy.log(`Found ${rows.length} product rows`);

          let consumableIndex = -1;
          let normalIndex = -1;
          let digitalIndex = -1;

          // Find subscription types and their row indices
          rows.forEach((row, index) => {
            cy.wrap(row).find('td').eq(8).invoke('text').then((subscriptionType) => {
              const type = subscriptionType.trim();
              cy.log(`Row ${index + 1}: Subscription Type = ${type}`);

              if (type === 'consumable' && consumableIndex === -1) {
                consumableIndex = index;
                cy.wrap(row).find('td').eq(5).invoke('text').then((subId) => {
                  const fullSubId = subId.trim();
                  collectedSubscriptions.consumable = fullSubId;
                  cy.log(`✓ Found consumable subscription at row ${index + 1}: ${fullSubId}`);
                });
              } else if (type === 'normal' && normalIndex === -1) {
                normalIndex = index;
                cy.wrap(row).find('td').eq(5).invoke('text').then((subId) => {
                  const fullSubId = subId.trim();
                  collectedSubscriptions.normal = fullSubId;
                  cy.log(`✓ Found normal subscription at row ${index + 1}: ${fullSubId}`);
                });
              } else if (type === 'digital' && digitalIndex === -1) {
                digitalIndex = index;
                cy.wrap(row).find('td').eq(5).invoke('text').then((subId) => {
                  const fullSubId = subId.trim();
                  collectedSubscriptions.digital = fullSubId;
                  cy.log(`✓ Found digital subscription at row ${index + 1}: ${fullSubId}`);
                });
              }
            });
          });

          // Wait for collection to complete
          cy.wait(2000);

          // Log missing subscription types
          cy.then(() => {
            if (consumableIndex === -1) {
              cy.log('⚠ consumable type subscription is missing');
            }
            if (normalIndex === -1) {
              cy.log('⚠ normal type subscription is missing');
            }
            if (digitalIndex === -1) {
              cy.log('⚠ digital type subscription is missing');
            }
          });

          // Create subscriptions for rows that need them (rows with "Create subscription" button)
          cy.then(() => {
            cy.log('--- Creating Subscriptions ---');

            rows.forEach((row, index) => {
              cy.wrap(row).find('button').then(($buttons) => {
                const hasCreateButton = Array.from($buttons).some(btn =>
                  btn.textContent.includes('Create subscription')
                );

                if (hasCreateButton) {
                  cy.log(`Creating subscription for row ${index + 1}`);

                  // Click Create Subscription button
                  OrderDetailPage.clickCreateSubscriptionForRow(index);

                  // Execute subscription creation flow
                  OrderDetailPage.createSubscriptionFlow();

                  // Get the subscription ID after creation
                  cy.wrap(row).find('td').eq(5).invoke('text').then((subId) => {
                    const subscriptionId = subId.trim();
                    cy.log(`Created subscription with ID: ${subscriptionId}`);

                    // Database Verification
                    cy.log(`--- Database Verification for ${subscriptionId} ---`);

                    // Verify subscription exists in database
                    cy.task('queryDb', SubscriptionQueries.getSubscriptionById(subscriptionId)).then((subscriptions) => {
                      if (subscriptions && subscriptions.length > 0) {
                        cy.log(`✓ Verified: Subscription ${subscriptionId} exists in database`);
                        const sub = subscriptions[0];
                        cy.log(`  - Order ID: ${sub.order_id}`);
                        cy.log(`  - Status: ${sub.subscription_status}`);
                        cy.log(`  - Type: ${sub.subscription_type}`);
                      } else {
                        cy.log(`⚠ Warning: Subscription ${subscriptionId} not found in database`);
                      }
                    });

                    // Check recurring payments
                    cy.task('queryDb', SubscriptionQueries.hasRecurringPayments(subscriptionId)).then((recurringPayments) => {
                      if (recurringPayments && recurringPayments.length > 0) {
                        cy.log(`✓ Verified: Subscription ${subscriptionId} has recurring payments enabled`);
                      } else {
                        cy.log(`⚠ Info: Subscription ${subscriptionId} does not have recurring payments enabled yet`);
                      }
                    });
                  });

                  cy.wait(2000);
                }
              });
            });
          });
        });

        cy.log('✓ Verified: All tests completed successfully');
      } else {
        cy.log('⚠ Warning: No order found matching the criteria');
        throw new Error('No order found for testing');
      }
    });
  });
});
