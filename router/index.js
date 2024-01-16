const router = require("express").Router();
const bcrypt = require("bcrypt");
const {Hr,validateHr} =require("../models/hr/hr.models")
const authHR = require("../lib/auth-hr")
require("dotenv").config();


router.post("/login", async (req, res) => {
    try {
      const hr = await Hr.findOne({
        Hr_username: req.body.username,
      });
      if (!hr) return await checkCandidate(req, res);
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

  const checkCandidate = async (req, res) => {
    // try {
    //   const manager = await Manager.findOne({
    //     manager_username: req.body.username,
    //   });
    //   if (!manager) return await checkEmployee(req, res);
    //   // if (!manager) {
    //   //   // await checkEmployee(req, res);
    //   //   console.log("123456");
    //   // }
    //   const validPasswordAdmin = await bcrypt.compare(
    //     req.body.password,
    //     manager.manager_password
    //   );
    //   if (!validPasswordAdmin) {
    //     // รหัสไม่ตรง
    //     return res.status(401).send({
    //       message: "password is not find",
    //       status: false,
    //     });
    //   } else {
    //     const token = manager.generateAuthToken();
    //     const ResponesData = {
    //       name: manager.manager_username,
    //       username: manager.manager_password,
    //       // shop_id: cashier.cashier_shop_id,
    //     };
    //     return res.status(200).send({
    //       status: true,
    //       token: token,
    //       message: "เข้าสู่ระบบสำเร็จ",
    //       result: ResponesData,
    //       level: "manager",
    //       position: manager.manager_role,
    //     });
    //   }
    // } catch (error) {
    //   return res
    //     .status(500)
    //     .send({message: "Internal Server Error", status: false});
    // }
  };

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
      } if (decoded && decoded.row === "candidate") {
        const id = decoded._id;
        const manager = await Manager.findOne({_id: id});
        if (!manager) {
          return res
            .status(400)
            .send({message: "มีบางอย่างผิดพลาด", status: false});
        } else {
          return res.status(200).send({
            shop_id: manager.manager_shop_id,
            name: manager.manager_name,
            username: manager.manager_username,
            position: manager.manager_position,
            level: manager.manager_role,
          });
        }
        manager;
      }
    } catch (error) {
      res.status(500).send({message: "Internal Server Error", status: false});
    }
  });

module.exports = router;