// adyen-chargeback.cy.js

describe('Adyen Chargeback - Settled Transaction', () => {
  
  it('create chargeback for JL4SKZP2DN7HGS75', () => {
    
    const crypto = require('crypto');
    const hmacKey = 'C0BF9C3BF2DCCD9AEF6575DC4A5E71A9D70018D1A856652BD60B2E5D37377E51';
    
    const pspReference = 'CHARGEBACK_' + Date.now();
    const originalReference = 'JL4SKZP2DN7HGS75';
    const merchantAccountCode = 'Circuly_Nok_Account_TEST';
    const merchantReference = 'CHARGEBACK_TEST';
    const value = 0.96; // Amount in cents
    const currency = 'EUR';
    const eventCode = 'CHARGEBACK';
    const success = 'true';
    
    // Generate HMAC signature in correct order
    const signatureData = [
      pspReference,
      originalReference,
      merchantAccountCode,
      merchantReference,
      value,
      currency,
      eventCode,
      success
    ].join(':');
    
    const hmacSignature = crypto
      .createHmac('sha256', Buffer.from(hmacKey, 'hex'))
      .update(signatureData)
      .digest('base64');
    
    cy.log('Signature Data:', signatureData);
    cy.log('HMAC Signature:', hmacSignature);
    
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
          NotificationRequestItem: {
            amount: {
              currency: currency,
              value: value
            },
            eventCode: eventCode,
            eventDate: new Date().toISOString(),
            merchantAccountCode: merchantAccountCode,
            merchantReference: merchantReference,
            originalReference: originalReference,
            pspReference: pspReference,
            reason: 'Fraudulent',
            success: success,
            additionalData: {
              hmacSignature: hmacSignature
            }
          }
        }]
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log('Chargeback Status:', response.status);
      cy.log('Response:', JSON.stringify(response.body, null, 2));
      
      if (response.status === 200) {
        cy.log('✅ Chargeback webhook accepted');
      } else {
        cy.log('⚠️ Webhook failed:', response.status);
      }
    });
  });
});