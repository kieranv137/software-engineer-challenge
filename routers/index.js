const express = require("express");
const router = express.Router();
router.use(express.json());
router.get("/exportChart", require("./exportChart"));
module.exports = router;
