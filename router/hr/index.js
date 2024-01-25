const router = require("express").Router();
const authHr = require("../../lib/auth-hr")
const Hr = require("../../controllers/hr/hr.controller")

router.post("/create", Hr.create);
router.put("/EditHr/:id", Hr.EditHr)
router.get("/GetHrAll", Hr.GetHrAll)
router.get("/getHrBy/:id", Hr.getHrById)
router.delete("/deleteHr/:id", Hr.deleteHr)
router.delete("/deleteHrAll", Hr.deleteHrAll)
module.exports = router; 