const router = require("express").Router();
const authHr = require("../../lib/auth-hr")
const Cadidate = require("../../controllers/candidate/candidate.contrller")

router.post("/create", Cadidate.create);
router.put("/EditCandidate/:id",Cadidate.EditCandidate)//เเก้ไขข้อมูลผู้สมัครงาน
router.put("/ImportResume/:id",Cadidate.ImportResume)
router.delete("/deleteCandidate/:id",Cadidate.deleteCandidate)
router.delete("/deleteCandidateAll",Cadidate.deleteCandidateAll)
router.get("/GetCadidateAll",Cadidate.GetCadidateAll)
router.get("/GetCadidateByIdCard/:id",Cadidate.GetCadidateByIdCard)
router.get("/GetCadidateBy/:id",Cadidate.GetCadidateById)
module.exports = router; 