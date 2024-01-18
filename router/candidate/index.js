const router = require("express").Router();
const authHr = require("../../lib/auth-hr")
const Cadidate = require("../../controllers/candidate/candidate.contrller")

router.post("/create", Cadidate.create);
router.put("/EditCandidate/:id",Cadidate.EditCandidate)
router.delete("/deleteCandidate/:id",Cadidate.deleteCandidate)
router.get("/GetCadidateAll",Cadidate.GetCadidateAll)
router.get("/GetCadidate/:id",Cadidate.GetCadidateById)
module.exports = router; 