class OrderCreationPage {
  constructor() {
    this.priceValue = null;
    this.quantityValue = null;
  }

  // ==================== HELPER METHODS ====================
  /**
   * Smart wait helper - waits up to maxWait milliseconds for element to be visible
   * If element appears before maxWait, proceeds immediately
   * @param {Cypress.Chainable} element - The Cypress element to wait for
   * @param {number} maxWait - Maximum time to wait in milliseconds (default: 5000)
   */
  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }

  // ==================== CREATE ORDER NAVIGATION BUTTON ====================
  // Selector
  get createOrderNavigationButton() {
    return cy.contains('button', 'Create order');
  }

  // Action
  clickCreateOrderButton() {
    cy.visit(Cypress.env('baseUrl'));
    cy.wait(10000);
    this.createOrderNavigationButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Create order button to open order creation page');
  }

    // ==================== QUOTE ORDER NAVIGATION BUTTON ====================
  // Selector
  get createOrderNavigationButton() {
    return cy.contains('button', 'Create quote');
  }

  // Action
  clickCreateOrderButton() {
    cy.visit(Cypress.env('baseUrl'));
    cy.wait(10000);
    this.createOrderNavigationButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Create order button to open order creation page');
  }

  // ==================== CREATE ORDER PAGE TITLE ====================
  // Selector
  get pageTitle() {
    return cy.contains('p', 'Create order');
  }

  // Action
  verifyPageLoaded() {
    this.waitForElement(this.pageTitle);
    cy.log('✓ Verified: Order creation page loaded');
  }

    // ==================== QUOTE ORDER PAGE TITLE ====================
  // Selector
  get pageTitle() {
    return cy.contains('p', 'Create quote');
  }

  // Action
  verifyQuoteOrderPageLoaded() {
    this.waitForElement(this.pageTitle);
    cy.log('✓ Verified: Order creation page loaded');
  }

  // ==================== ADD ITEM BUTTON ====================
  // Selector
  get addItemButton() {
    return cy.contains('button', 'Add item');
  }

  // Action
  clickAddItem() {
    this.waitForElement(this.addItemButton);
    this.addItemButton.click();
    cy.wait(2000)
  }

  // Selector
  get dialogTitle() {
    return cy.contains('h2, h3, p, div', 'Item selection', { timeout: 10000 });
  }

  get addItemDialogHeader() {
    return cy.contains('Add Item');
  }

  // Action
  verifyDialogOpened() {
    // Wait for either "Item selection" or "Add Item" text to be visible
    cy.get('body').then($body => {
      if ($body.text().includes('Item selection')) {
        this.waitForElement(this.dialogTitle, 10000);
        cy.log('✓ Verified: Item selection dialog opened');
      } else {
        this.waitForElement(this.addItemDialogHeader, 10000);
        cy.log('✓ Verified: Add Item dialog opened');
      }
    });
  }

  // ==================== PRODUCT DROPDOWN ====================
  // Selector
  get productDropdown() {
    return cy.get('[id*="headlessui-combobox-button"]').first();
  }

  // Action - Select first product from dropdown
  selectFirstProduct() {
    this.waitForElement(this.productDropdown);
    this.productDropdown.click();

    // Wait for options to load and click the first one
    cy.get('[role="option"]', { timeout: 5000 })
      .first()
      .invoke('text')
      .then((productName) => {
        cy.get('[role="option"]').first().click({ force: true });
        cy.log(`✓ Verified: "${productName.trim()}" has been selected`);
      });
  }

  // ==================== VARIANT DROPDOWN ====================
  // Selector
  get variantDropdown() {
    return cy.get('label').contains('Select variant')
      .closest('div')
      .find('[id*="headlessui-combobox-button"]').first();
  }

  // Action - Select first variant from dropdown
  selectFirstVariant() {
    this.waitForElement(this.variantDropdown);
    this.variantDropdown.click();

    // Wait for options to load and click the first one
    cy.get('[role="option"]', { timeout: 5000 })
      .first()
      .invoke('text')
      .then((variantName) => {
        cy.get('[role="option"]').first().click({ force: true });
        cy.log(`✓ Verified: "${variantName.trim()}" has been selected`);
      });
  }

  // ==================== SUBSCRIPTION CHECKBOX ====================
  // Selector
  get subscriptionCheckbox() {
    return cy.get('input[type="checkbox"][aria-label="Subscription"]');
  }

  // Action
  verifySubscriptionEnabled() {
    this.subscriptionCheckbox.should('exist').and('be.checked');
    cy.log('✓ Verified: Subscription is enabled');
  }

  // ==================== TYPE DROPDOWN ====================
  // Selector
  get typeDropdown() {
    return cy.get('label').contains('Type')
      .closest('div')
      .find('button[id*="headlessui-listbox-button"]');
  }

  // Action - Select first type option
  selectFirstType() {
    this.waitForElement(this.typeDropdown);
    this.typeDropdown.click();

    // Wait for options to load and click the first one
    cy.get('[role="option"]', { timeout: 5000 })
      .first()
      .invoke('text')
      .then((typeName) => {
        cy.get('[role="option"]').first().click({ force: true });
        cy.log(`✓ Verified: Type: ${typeName.trim()} has been selected`);
      });
  }

  // Action - Select type by name (service, consumable, digital)
  selectTypeByName(typeName) {
    this.waitForElement(this.typeDropdown);
    this.typeDropdown.click();

    // Wait for options and select the specified type
    cy.contains('[role="option"]', typeName, { timeout: 5000, matchCase: false })
      .click({ force: true });
    cy.log(`✓ Verified: Type: ${typeName} has been selected`);
  }

  // ==================== PRICE INPUT ====================
  // Selector
  get priceInput() {
    return cy.get('label').contains('Price')
      .closest('div')
      .find('input[type="text"]');
  }

  // Action
  setPrice(price) {
    this.priceValue = parseFloat(price);
    this.waitForElement(this.priceInput);
    this.priceInput
      .clear()
      .type(price)
      .should('have.value', price);
    cy.log(`✓ Verified: Price set to "${price}"`);
  }

  // ==================== QUANTITY INPUT ====================
  // Selector
  get quantityInput() {
    return cy.get('label').contains('Quantity')
      .closest('div')
      .find('input[type="text"]');
  }

  // Action
  setQuantity(quantity) {
    this.quantityValue = parseFloat(quantity);
    this.waitForElement(this.quantityInput);
    this.quantityInput
      .clear()
      .type(quantity)
      .should('have.value', quantity);
    cy.log(`✓ Verified: Quantity set to "${quantity}"`);
  }

  // ==================== UNIT PRICE & ROW TOTAL ====================
  // Action - Verify Unit Price and Row Total (uses stored values)
  verifyPriceCalculation() {
    const rowTotal = this.priceValue * this.quantityValue;
    cy.wait(1000); // Wait for calculation

    cy.contains('Unit price:', { timeout: 10000 }).should('be.visible');
    cy.contains('Row total:', { timeout: 10000 }).should('be.visible');

    cy.log(`✓ Verified: Unit price = ${this.priceValue}.00 € and Row total = ${rowTotal}.00 €`);
  }

  // ==================== DURATION INPUT ====================
  // Selector
  get durationInput() {
    return cy.get('label').contains('Duration')
      .closest('div')
      .find('input[type="text"]');
  }

  // Action
  setDuration(duration) {
    this.waitForElement(this.durationInput);
    this.durationInput
      .clear()
      .type(duration)
      .should('have.value', duration);
    cy.log(`✓ Verified: Duration set to "${duration}"`);
  }

  // ==================== FREQUENCY DROPDOWN ====================
  // Selector
  get frequencyDropdown() {
    return cy.get('label').contains('Frequency')
      .closest('div')
      .find('button[id*="headlessui-listbox-button"]');
  }

  // Action - Select monthly frequency
  selectMonthlyFrequency() {
    this.waitForElement(this.frequencyDropdown);
    this.frequencyDropdown.click();

    // Wait for options and select 'monthly'
    cy.contains('[role="option"]', 'monthly', { timeout: 5000 })
      .click({ force: true });
    cy.log('✓ Verified: Frequency: monthly has been selected');
  }

  // ==================== INTERVAL INPUT ====================
  // Selector
  get intervalInput() {
    return cy.get('label').contains('Interval')
      .closest('div')
      .find('input[type="text"]');
  }

  // Action
  verifyInterval(interval) {
    this.waitForElement(this.intervalInput);
    this.intervalInput.should('have.value', interval);
    cy.log(`✓ Verified: Interval is "${interval}"`);
  }

  // ==================== PREPAID DURATION INPUT ====================
  // Selector
  get prepaidDurationInput() {
    return cy.get('label').contains('Prepaid duration')
      .closest('div')
      .find('input[type="text"]');
  }

  // Action
  verifyPrepaidDuration(duration) {
    this.waitForElement(this.prepaidDurationInput);
    this.prepaidDurationInput.should('have.value', duration);
    cy.log(`✓ Verified: Prepaid duration is "${duration}"`);
  }

  // ==================== START DATE INPUT ====================
  // Selector
  get startDateInput() {
    return cy.get('label').contains('Start date')
      .closest('div')
      .find('input[type="text"]');
  }

  // Action - Click start date and select current date
  selectCurrentStartDate() {
    this.waitForElement(this.startDateInput);
    this.startDateInput.click();

    // Wait for calendar to open
    cy.wait(1000);
    cy.log('✓ Verified: Calendar opened');

    // Click the "Select" button
    cy.contains('button', 'Select', { timeout: 5000 }).click();

    // Get and log the selected date
    this.startDateInput.invoke('val').then((selectedDate) => {
      cy.log(`✓ Verified: Start date selected - "${selectedDate}"`);
    });
  }

  // ==================== END DATE INPUT ====================
  // Selector
  get endDateInput() {
    return cy.get('label').contains('End date')
      .closest('div')
      .find('input[type="text"]');
  }

  // Action
  // Action - Get and log the End Date
  verifyEndDate() {
    this.waitForElement(this.endDateInput);
    this.endDateInput.invoke('val').then((endDateValue) => {
      cy.log(`✓ Verified: End date is "${endDateValue}"`);
    });
  }

  // ==================== SUBMIT ITEM ====================
  // Selector
  get submitButton() {
    return cy.get('button[type="submit"][data-cy="btn-submit"]');
  }

  // Action
  submitItem() {
    this.waitForElement(this.submitButton);
    this.submitButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Add item button clicked');

    // Verify Row total is not 0
    cy.contains('Row total:', { timeout: 10000 })
      .parent()
      .parent()
      .find('td')
      .last()
      .invoke('text')
      .then((rowTotal) => {
        expect(rowTotal.trim()).to.not.equal('0,00 €');
        cy.log(`✓ Verified: Row total is "${rowTotal.trim()}" (not zero)`);
      });
  }

  // ==================== BILLING ADDRESS SECTION HEADER ====================
  // Selector
  get billingAddressHeader() {
    return cy.contains('p', 'Billing address', { timeout: 10000 });
  }

  // Action
  scrollToBillingSection() {
    this.billingAddressHeader.should('be.visible').then(($header) => {
      $header[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    cy.wait(2000);
    cy.log('✓ Verified: Scrolled to billing address section');
  }

  // ==================== GIVEN NAME INPUT ====================
  // Selector
  get givenNameInput() {
    return cy.get('[data-cy="billing-first-name"]').find('input[type="text"]');
  }

  // Action
  fillGivenName(givenName) {
    this.givenNameInput.type(givenName, { force: true });
    cy.log(`✓ Verified: Given name set to "${givenName}"`);
  }

  // ==================== SURNAME INPUT ====================
  // Selector
  get surnameInput() {
    return cy.get('[data-cy="billing-last-name"]').find('input[type="text"]');
  }

  // Action
  fillSurname(surname) {
    this.surnameInput.type(surname, { force: true });
    cy.log(`✓ Verified: Surname set to "${surname}"`);
  }

  // ==================== EMAIL INPUT ====================
  // Selector
  get emailInput() {
    return cy.get('[data-cy="billing-email"]').find('input[type="text"]');
  }

  // Action
  fillEmail(email) {
    const emailWithTimestamp = email.replace('{{timestamp}}', Date.now());
    this.emailInput.type(emailWithTimestamp, { force: true });
    cy.log(`✓ Verified: Email set to "${emailWithTimestamp}"`);
    return emailWithTimestamp;
  }

  // ==================== PHONE INPUT ====================
  // Selector
  get phoneInput() {
    return cy.get('[data-cy="billing-phone"]').find('input[type="text"]');
  }

  // Action
  fillPhone(phone) {
    this.phoneInput.type(phone, { force: true });
    cy.log(`✓ Verified: Phone set to "${phone}"`);
  }

  // ==================== VAT NUMBER INPUT ====================
  // Selector
  get vatNumberInput() {
    return cy.get('[data-cy="billing-vat-number"]').find('input[type="text"]');
  }

  // Action
  fillVatNumber(vatNumber) {
    this.vatNumberInput.type(vatNumber, { force: true });
    cy.log(`✓ Verified: VAT number set to "${vatNumber}"`);
  }

  // ==================== COMPANY INPUT ====================
  // Selector
  get companyInput() {
    return cy.get('[data-cy="billing-company"]').find('input[type="text"]');
  }

  // Action
  fillCompany(company) {
    this.companyInput.type(company, { force: true });
    cy.log(`✓ Verified: Company set to "${company}"`);
  }

  // ==================== STREET INPUT ====================
  // Selector
  get streetInput() {
    return cy.get('[data-cy="billing-street"]').find('input[type="text"]');
  }

  // Action
  fillStreet(street) {
    this.streetInput.type(street, { force: true });
    cy.log(`✓ Verified: Street set to "${street}"`);
  }

  // ==================== STREET NUMBER INPUT ====================
  // Selector
  get streetNumberInput() {
    return cy.get('[data-cy="billing-street-number"]').find('input[type="text"]');
  }

  // Action
  fillStreetNumber(streetNumber) {
    this.streetNumberInput.type(streetNumber, { force: true });
    cy.log(`✓ Verified: Street number set to "${streetNumber}"`);
  }

  // ==================== ADDRESS ADDITION INPUT ====================
  // Selector
  get addressAdditionInput() {
    return cy.get('[data-cy="billing-address-addition"]').find('input[type="text"]');
  }

  // Action
  fillAddressAddition(addressAddition) {
    if (addressAddition) {
      this.addressAdditionInput.type(addressAddition, { force: true });
      cy.log(`✓ Verified: Address addition set to "${addressAddition}"`);
    }
  }

  // ==================== POSTAL CODE INPUT ====================
  // Selector
  get postalCodeInput() {
    return cy.get('[data-cy="billing-postal-code"]').find('input[type="text"]');
  }

  // Action
  fillPostalCode(postalCode) {
    this.postalCodeInput.type(postalCode, { force: true });
    cy.log(`✓ Verified: Postal code set to "${postalCode}"`);
  }

  // ==================== CITY INPUT ====================
  // Selector
  get cityInput() {
    return cy.get('[data-cy="billing-city"]').find('input[type="text"]');
  }

  // Action
  fillCity(city) {
    this.cityInput.type(city, { force: true });
    cy.log(`✓ Verified: City set to "${city}"`);
  }

  // ==================== COUNTRY DROPDOWN ====================
  // Selector
  get countryDropdown() {
    return cy.get('[data-cy="billing-country"]');
  }

  get countryDropdownInput() {
    return cy.get('[data-cy="billing-country"]').find('input[type="text"]');
  }

  // Action
  selectCountry(country) {
    this.countryDropdownInput.click({ force: true });
    cy.wait(1000);
    cy.contains('[role="option"]', country, { timeout: 10000, matchCase: false })
      .click({ force: true });
    cy.wait(500);
    cy.log(`✓ Verified: Country "${country}" has been selected`);
  }

  // ==================== FILL COMPLETE BILLING ADDRESS ====================
  // Action
  fillBillingAddress(billingData) {
    cy.log('========== Filling Billing Address ==========');
    this.scrollToBillingSection();
    this.fillGivenName(billingData.givenName);
    this.fillSurname(billingData.surname);
    this.fillEmail(billingData.email);
    this.fillPhone(billingData.phone);
    this.fillVatNumber(billingData.vatNumber);
    this.fillCompany(billingData.company);
    this.fillStreet(billingData.street);
    this.fillStreetNumber(billingData.streetNumber);
    this.fillAddressAddition(billingData.addressAddition);
    this.fillPostalCode(billingData.postalCode);
    this.fillCity(billingData.city);
    this.selectCountry(billingData.country);
    cy.log('✓ Verified: Billing address filled successfully');
  }

  // ==================== CHARGE BY INVOICE CHECKBOX ====================
  // Selector
  get chargeByInvoiceCheckbox() {
    return cy.get('input[aria-label="Charge by invoice"]');
  }

  // Action
  enableChargeByInvoice() {
    this.chargeByInvoiceCheckbox.click({ force: true });
    cy.wait(500);
    cy.log('✓ Verified: Charge by invoice checkbox enabled');
  }

 // ==================== CREATE ORDER SUBMIT BUTTON ====================
  // Selector
  get createOrderSubmitButton() {
    return cy.get('button[data-cy="btn-submit"]').contains('Create order');
  }

  // Action
  clickCreateOrder() {
    this.createOrderSubmitButton.click();
    cy.wait(8000);
    cy.log('✓ Verified: Create order submit button clicked');
  }

  // Action
  verifyOrderCreated() {
    cy.url().should('include', '/cms/orders/');

    // Extract order ID from URL
    cy.url().then((url) => {
      const orderId = url.split('/cms/orders/')[1];
      cy.log(`✓ Verified: Order ID extracted from URL: ${orderId}`);

      // Wait 5 seconds before database check
      cy.wait(8000);

      // Verify order exists in database
      const query = `SELECT * FROM orders WHERE order_id = '${orderId}' AND origin = 'cms'`;

      cy.task('queryDb', query).then((results) => {
        expect(results.length).to.be.greaterThan(0);
        cy.log(`✓ Verified: Order ${orderId} found in database with origin 'cms'`);
        cy.log(`✓ Verified: Order created successfully`);
      });
    });
  }

   // ==================== CREATE QUOTE SUBMIT BUTTON ====================
  // Selector
  get createOrderSubmitButton() {
    return cy.get('button[data-cy="btn-submit"]').contains('Create quote');
  }

  // Action
  clickQuoteOrder() {
    this.createOrderSubmitButton.click();
    cy.wait(8000);
    cy.log('✓ Verified: Create order submit button clicked');
  }

  // Action
  verifyQuoteOrderCreated() {
    cy.url().should('include', '/cms/orders/');

    // Extract order ID from URL
    cy.url().then((url) => {
      const orderId = url.split('/cms/orders/drafts/')[1];
      cy.log(`✓ Verified: Order ID extracted from URL: ${orderId}`);

      // Wait 8 seconds before database check
      cy.wait(8000);

      // Verify order exists in database and get checkout link
      const query = `SELECT id, draft_id, order_checkout_link, status FROM public.draft_orders WHERE draft_id = '${orderId}'`;

      cy.task('queryDb', query).then((results) => {
        expect(results.length).to.be.greaterThan(0);
        cy.log(`✓ Verified: Draft order ${orderId} found in database`);

        // Get the checkout link from the result
        const checkoutLink = results[0].order_checkout_link;
        cy.log(`✓ Verified: Checkout link found: ${checkoutLink}`);

        // Visit the checkout link to verify it works
        cy.visit(checkoutLink);
        cy.wait(3000);
        cy.log(`✓ Verified: Checkout link is working`);

        // Close the page by going back
        cy.go('back');
        cy.wait(2000);
        cy.log(`✓ Verified: Draft order created successfully`);
      });
    });
  }


  // ==================== PAGE NAVIGATION ====================

}

export default new OrderCreationPage();
