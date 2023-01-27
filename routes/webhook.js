const express = require("express");
const router = express.Router();

const {installment} = require("../controllers/webhook");

router.post("/installment",express.raw({type: 'application/json'}), installment);

module.exports = router;