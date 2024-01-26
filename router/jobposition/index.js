const router = require("express").Router();
const authHr = require("../../lib/auth-hr")
const jobposition = require("../../controllers/jobposition/jobposition.controllers")


router.post("/create",jobposition.create)


module.exports = router; 