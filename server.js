const express = require('express');
require('dotenv').config();

const port = process.env.PORT;
console.log('env', process.env.PORT);
const app = express();

app.use(express.json());

const userRoutes = require("./routes/User");
const bookingRoutes = require("./routes/Booking");

app.use("/user", userRoutes);
app.use("/booking", bookingRoutes);

app.listen(port, () => console.log('server listening on port ' + port));
