const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const {Hr,validateHr} = require("../../models/hr.models")

exports.create = async (req, res) => {
    try {
      const {error} = validateHr(req.body);
      if (error) {
        return res
          .status(400)
          .send({status: false, message: error.details[0].message});
      }
      const user = await Hr.findOne({
        Hr_username: req.body.Hr_username,
      });
      if (user) {
        return res.status(400).send({
          status: false,
          message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
        });
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.hr_password, salt);
        await new Hr({
          ...req.body,
          hr_password: hashPassword,
        }).save();
        return res.status(200).send({message: "สร้างข้อมูลสำเร็จ", status: true});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };