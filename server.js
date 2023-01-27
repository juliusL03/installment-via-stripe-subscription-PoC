const express = require('express');

require('dotenv').config();

const port = process.env.PORT;
console.log('env', process.env.PORT);
const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(
    express.json({
      // We need the raw body to verify webhook signatures.
      // Let's compute it only when hitting the Stripe webhook endpoint.
      verify: function (req, res, buf) {
        if (req.originalUrl.startsWith("/webhook/installment")) {
          req.rawBody = buf.toString();
        }
      },
    })
);

const userRoutes = require("./routes/User");
const bookingRoutes = require("./routes/Booking");
const webhookRoutes = require("./routes/webhook");

app.use("/user", userRoutes);
app.use("/booking", bookingRoutes);
app.use("/webhook",webhookRoutes);

app.listen(port, () => console.log('server listening on port ' + port));
