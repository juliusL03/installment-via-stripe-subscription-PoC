const express = require("express");
const router = express.Router();

const {add} = require("../controllers/User");

router.post("/add", add)

module.exports = router;