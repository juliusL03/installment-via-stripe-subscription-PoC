const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require("../models");
const {monthsFromNow} = require('../utils/date');

const bookingInstallment = async (req, res) => {

    const {name, description, prices} = req.body;
    
    try {
      const stripeProduct = await stripe.products.create({
        name: name,
        description: description
      });

      const [upfrontPrice] = prices.filter(price => price.nickname === 'upfront');
      const [subscriptionPrice] = prices.filter(price => price.nickname === 'subscription');

      // create a stripe price for upfront
      const upfrontStripePrice = await stripe.prices.create({
        unit_amount: upfrontPrice.unit_amount,
        currency: upfrontPrice.currency,
        recurring: upfrontPrice.recurring,
        product: stripeProduct.id,
      });

      // create a stripe price for subscription
      const subscriptionStripePrice = await stripe.prices.create({
        unit_amount: subscriptionPrice.unit_amount,
        currency: subscriptionPrice.currency,
        recurring: subscriptionPrice.recurring,
        product: stripeProduct.id,
      });

      // try
      const testClock = await stripe.testHelpers.testClocks.create({
        frozen_time: parseInt(new Date().getTime() / 1000),
      });
      console.log('chkCus', testClock);
      const customer = await stripe.customers.create({
        test_clock: testClock.id
      });
      console.log('chkCus1', customer);
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 11,
          exp_year: 2024,
          cvc: '314',
        },
      });
      console.log('chkCus2', paymentMethod);
      const attID = await stripe.paymentMethods.attach(
        paymentMethod.id,
        {customer: customer.id}
      );
      console.log('chkCus3', attID);

       await stripe.customers.update(
        customer.id, { // <-- your customer id from the request body
        
          invoice_settings: {
            default_payment_method: attID.id, // <-- your payment method ID collected via Stripe.js
          },
      });
    
      //


      // create a invoice for upfront payment
      const invoiceItem = await stripe.invoiceItems.create({
        customer: customer.id,// process.env.CUSTOMER_ID,
        price: upfrontStripePrice.id,
        description: name + '-upfront'
      });

      // create a subscription payment
      const stripeSubscription = await stripe.subscriptions.create({
        customer: customer.id,//process.env.CUSTOMER_ID,
        cancel_at: monthsFromNow(2),
        items: [
          {
            price: subscriptionStripePrice.id,
          },
        ],
        description: name + '-subscription'
      });
      
      let stripeInvoice = await stripe.invoices.retrieve(stripeSubscription.latest_invoice); 

      if (stripeInvoice.status === 'open') {
        stripeInvoice = await stripe.invoices.pay(stripeSubscription.latest_invoice);
      }

      // let paymentStatus = {};

      // if (stripeSubscription.latest_invoice != null && stripeInvoice.status === 'paid') {
      //     paymentStatus.installment = {
      //       upfront: stripeInvoice.status,
      //       second: 'pending',
      //       third: 'pending'
      //     }

      //     await db.bookings.create({
      //       paymentStatus: paymentStatus,
      //       transactions: stripeSubscription
      //     });
      // }

      return res.status(200).json({
        msg: "installment paid successfully...",
        stripeProduct,
        invoiceItem, 
        stripeSubscription,
        stripeInvoice: stripeInvoice.lines.data
        // paymentStatus,
      });

    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'An error has occurred, please try again.',
        hideMessage: false,
        errorName: err.name,
        debug: {error: err}
      });
    }
}

module.exports = {
  bookingInstallment
};
