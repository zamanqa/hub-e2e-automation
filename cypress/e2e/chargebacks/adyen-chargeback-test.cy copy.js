// adyen-chargeback.cy.js

describe('Adyen Chargeback - Settled Transaction', () => {
  
  it('create chargeback for DWZQTW82QXZ776V5', () => {
    
    const crypto = require('crypto');
    const hmacKey = 'C0BF9C3BF2DCCD9AEF6575DC4A5E71A9D70018D1A856652BD60B2E5D37377E51';
    
    const notificationItem = {
      amount: {
        currency: 'EUR',
        value: 1689
      },
      eventCode: 'CHARGEBACK',
      eventDate: new Date().toISOString(),
      merchantAccountCode: 'Circuly_Nok_Account_TEST',
      merchantReference: 'CHARGEBACK_TEST',
      originalReference: 'DWZQTW82QXZ776V5',
      pspReference: 'CHARGEBACK_' + Date.now(),
      reason: 'Fraudulent',
      success: 'true'
    };
    
    // Generate HMAC signature
    const signatureData = [
      notificationItem.pspReference,
      notificationItem.originalReference,
      notificationItem.merchantAccountCode,
      notificationItem.merchantReference,
      notificationItem.amount.value,
      notificationItem.amount.currency,
      notificationItem.eventCode,
      notificationItem.success
    ].join(':');
    
    const hmacSignature = crypto
      .createHmac('sha256', Buffer.from(hmacKey, 'hex'))
      .update(signatureData)
      .digest('base64');
    
    // Add HMAC signature to notification item
    notificationItem.additionalData = {
      hmacSignature: hmacSignature
    };
    
    // Send chargeback notification webhook
    cy.request({
      method: 'POST',
      url: 'https://circuly-lumen.herokuapp.com/v1/7a79-30433733la/adyen/webhook',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        live: 'false',
        notificationItems: [{
          NotificationRequestItem: notificationItem
        }]
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log('Chargeback Status:', response.status);
      cy.log('Response:', JSON.stringify(response.body, null, 2));
    });
  });
});