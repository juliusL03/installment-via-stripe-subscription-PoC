const db = require("../models");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const add = async (req, res) => {

    const {name, email} = req.body;
    
    try {
  
      const stripeData = await stripe.customers.create({
        name: name,
        email: email,
        description: "from node"
      });

      await db.User.create({
        name,
        email,
        stripeCustomerID: stripeData.id
      });

      const userData = await db.User.findOne({
        where: {
          name
        }
      });

      let param = {};
      param.card ={
          number: '4242424242424242',
          exp_month: 2,
          exp_year:2024,
          cvc:'212'
      }

      await stripe.tokens.create(param, async function (err,token) {
        if(err)
        {
          console.log("err: "+err);
        }if(token)
        {
          const getToken = JSON.parse(JSON.stringify(token, null, 2));

          await db.User.update({
            stripeToken: getToken.id,
            card: getToken.card
          },
          {
            where:{
              name
          }});

          await stripe.customers.createSource(userData.stripeCustomerID,{source: getToken.id}, function (err,card) {
            if(err)
            {
                console.log("err: "+err);
            }if(card)
            {
                console.log("successCard: "+JSON.stringify(card, null, 2));
            }else{
                console.log("Something wrong")
            }
          })
          console.log("success: "+ getToken.id);
        }else{
          console.log("Something wrong")
        }
      });

      // console.log('dataLog', getToken);
      const userResult = await db.User.findOne({
        where: {
          name
        }
      });

      return res.json({
        msg: "ok",
        user: [userResult, stripeData]
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
  add
};
