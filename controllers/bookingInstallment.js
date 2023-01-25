const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

      // create a invoice for upfront payment
      const invoiceItem = await stripe.invoiceItems.create({
        customer: process.env.CUSTOMER_ID,
        price: upfrontStripePrice.id,
        description: name + '-upfront'
      });

      // create a subscription payment
      const subscription = await stripe.subscriptions.create({
        customer: process.env.CUSTOMER_ID,
        items: [
          {
            price: subscriptionStripePrice.id,
          },
        ],
        description: name + '-subscription'
      });


      return res.status(200).json({
        msg: "product add successfully...",
        product: [stripeProduct, invoiceItem, subscription]
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
