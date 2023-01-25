const express = require("express");
const router = express.Router();

const {bookingInstallment} = require("../controllers/bookingInstallment");

router.post("/installment", bookingInstallment)

module.exports = router;