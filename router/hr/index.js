const router = require("express").Router();
const authHr = require("../../lib/auth-hr")
const Hr = require("../../controllers/hr/hr.controller")

router.post("/create", Hr.create);


module.exports = router; 