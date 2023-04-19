const express = require("express");
const router = express.Router();
router.use(express.json());

router.post("/request1", require("./request1"));
router.post("/request2", require("./request2"));
router.post("/request3", require("./request3"));
router.post("/request4", require("./request4"));
router.post("/request5", require("./request5"));
module.exports = router;
