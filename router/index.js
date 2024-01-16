const router = require("express").Router();
const bcrypt = require("bcrypt");
const {Hr,validateHr} =require("../models/hr.models")
const authHR = require("../lib/auth-hr")
require("dotenv").config();


router.post("/login", async (req, res) => {
    try {
      const hr = await Hr.findOne({
        Hr_username: req.body.username,
      });
    //   if (!hr) return await checkManager(req, res);
      const validateHr = await bcrypt.compare(
        req.body.password,
        hr.hr_password
      );
  
      if (!validateHr) {
        return res.status(401).send({
          status: false,
          message: "รหัสผ่านไม่ถูกต้อง",
        });
      }
      const token = hr.generateAuthToken();
      const responseData = {
        name: hr.hr_name,
        username: hr.Hr_username,
        position: hr.hr_position,
      };
  
      return res.status(200).send({
        status: true,
        token: token,
        message: "เข้าสู่ระบบสำเร็จ",
        result: responseData,
        level: "hr",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({status: false, message: "Internal Server Error"});
    }
  });

router.get("/me", authHR, async (req, res) => {
    try {
      const {decoded} = req;
      if (decoded && decoded.row === "hr") {
        const id = decoded._id;
        const hr = await Hr.findOne({_id: id});
        if (!hr) {
          return res
            .status(400)
            .send({message: "มีบางอย่างผิดพลาด", status: false});
        } else {
          return res.status(200).send({
            name: hr.hr_name,
            username: hr.Hr_username,
            position: "hr",
            level: hr.hr_position,
          });
        }
      }
    } catch (error) {
      res.status(500).send({message: "Internal Server Error", status: false});
    }
  });

module.exports = router;