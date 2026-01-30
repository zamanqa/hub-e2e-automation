// braintree-chargeback.cy.js

describe('Braintree Chargeback', () => {
  
  const TRANSACTION_ID = '4qqs44aa'; // Transaction to chargeback
  const WEBHOOK_URL = 'https://lpsuitetest1.wiwwo.com/circuly_core_checkout/webhook-00-webhookReceiver.php';
  
  it('create chargeback for transaction 4qqs44aa', () => {
    
    const disputePayload = {
      kind: 'dispute_opened',
      timestamp: new Date().toISOString(),
      subject: {
        dispute: {
          id: 'DISPUTE_' + Date.now(),
          amount_disputed: '9.37', // Full amount - adjust if needed
          currency_iso_code: 'EUR',
          received_date: new Date().toISOString().split('T')[0],
          reply_by_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          kind: 'chargeback',
          status: 'open',
          reason: 'fraud',
          reason_code: '83',
          transaction: {
            id: TRANSACTION_ID,
            amount: '100.00' // Full amount - adjust if needed
          }
        }
      }
    };
    
    const btPayload = btoa(JSON.stringify(disputePayload));
    
    cy.log('Creating chargeback for transaction:', TRANSACTION_ID);
    
    cy.request({
      method: 'POST',
      url: WEBHOOK_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `bt_signature=&bt_payload=${encodeURIComponent(btPayload)}`,
      timeout: 30000,
      failOnStatusCode: false
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('✅ Chargeback webhook sent for', TRANSACTION_ID);
    });
  });
});