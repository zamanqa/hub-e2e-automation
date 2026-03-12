import OrderListPage from '../../support/page-objects/01-order-page/OrderListPage';
import OrderDetailPage from '../../support/page-objects/01-order-page/OrderDetailPage';
import OrderQueries from '../../support/helpers/01-order-page/order-queries';
import SubscriptionQueries from '../../support/helpers/02-subscription-page/subscription-queries';

describe('Order Detail Page', () => {
  let testOrderId;
  const testNoteMessage = `Automated test note - ${Date.now()}`;

  before(() => {
    cy.task('queryDb', OrderQueries.getFifthOrderWithoutSubscription()).then((orders) => {
      expect(orders, 'Expected at least 1 order without subscription in DB').to.have.length.at.least(1);
      testOrderId = orders[0].order_id;
      cy.log(`✓ Test order from DB: ${testOrderId}`);
    });
  });

  beforeEach(() => {
    OrderListPage.navigateToOrderList();
    OrderListPage.searchByOrderId(testOrderId);
    OrderListPage.clickOnOrderFromList(testOrderId);
  });

  // ===========================================================================
  // TEST 1 — Navigate to order detail page and verify URL
  // ===========================================================================
  it('Test 1: should navigate to order detail page and verify URL', () => {
    cy.log('========== Test 1: Navigate to Order Detail ==========');

    OrderDetailPage.verifyUrlContainsOrderId(testOrderId);

    cy.log('✓ Test 1 Completed: Order detail page URL verified');
  });

  // ===========================================================================
  // TEST 2 — Create a note and verify it appears in the notes section
  // ===========================================================================
  it('Test 2: should create a note and verify it is visible', () => {
    cy.log('========== Test 2: Create and Verify Note ==========');

    OrderDetailPage.clickCreateNote();
    OrderDetailPage.enterNoteMessage(testNoteMessage);
    OrderDetailPage.submitNote();
    OrderDetailPage.verifyNoteExists(testNoteMessage);

    cy.log('✓ Test 2 Completed: Note created and verified');
  });

  // ===========================================================================
  // TEST 3 — Create subscriptions for all product rows and verify in DB
  // ===========================================================================
  it('Test 3: should create subscriptions for all products and verify in DB', () => {
    cy.log('========== Test 3: Create Subscriptions for All Products ==========');

    OrderDetailPage.getAllProductRows().then(($rows) => {
      const rows = Array.from($rows);
      cy.log(`Found ${rows.length} product rows`);

      rows.forEach((row, index) => {
        cy.wrap(row).find('button').then(($buttons) => {
          const hasCreateButton = Array.from($buttons).some(btn =>
            btn.textContent.includes('Create subscription')
          );

          if (!hasCreateButton) return;

          cy.log(`Creating subscription for row ${index + 1}`);

          cy.wrap(row).find('td').eq(8).invoke('text').then((subType) => {
            const subscriptionType = subType.trim().toLowerCase();
            cy.log(`Row ${index + 1} subscription type: ${subscriptionType}`);

            OrderDetailPage.clickCreateSubscriptionForRow(index);
            OrderDetailPage.createSubscriptionFlow(subscriptionType);

            cy.wrap(row).find('td').eq(0).find('a[href*="/subscriptions/"]').invoke('attr', 'href').then((href) => {
              const subscriptionId = href.split('/subscriptions/')[1];
              cy.log(`Created subscription ID: ${subscriptionId}`);

              cy.task('queryDb', SubscriptionQueries.getSubscriptionById(subscriptionId)).then((result) => {
                expect(result, `Expected subscription ${subscriptionId} in DB`).to.have.length.at.least(1);
                const sub = result[0];
                cy.log(`✓ DB verified — Status: ${sub.subscription_status}, Type: ${sub.subscription_type}`);

                cy.task('queryDb', SubscriptionQueries.hasRecurringPayments(sub.id)).then((recurringPayments) => {
                  if (recurringPayments && recurringPayments.length > 0) {
                    cy.log(`✓ Subscription has recurring payments enabled`);
                  } else {
                    cy.log(`⚠ Subscription does not have recurring payments enabled yet`);
                  }
                });
              });
            });

            cy.wait(2000);
          });
        });
      });
    });

    cy.log('✓ Test 3 Completed: Subscriptions created and verified in DB');
  });
});
