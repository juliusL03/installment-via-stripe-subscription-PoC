const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const installment = async (req, res) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }
  // noted
  if (eventType === "invoice.payment_succeeded") {
    console.log('invoice', eventType, data);
    // check customer
    // check product
    //update the booking payment status
    // send a email
  }

  if (eventType === "invoice.payment_failed") {
    console.log('invoice', eventType, data);
    // check customer
    // check product
    //update the booking payment status
    // send a email
  } 
  console.log('invoice-', data);
  res.sendStatus(200);
   
}

module.exports = {
  installment
};
