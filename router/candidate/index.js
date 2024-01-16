const router = require("express").Router();
const authHr = require("../../lib/auth-hr")
const Cadidate = require("../../controllers/candidate/candidate.contrller")

router.post("/create", Cadidate.create);

module.exports = router; 