const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const { Hr, validateHr } = require("../../models/hr/hr.models");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    // console.log(file.originalname);
  },
});
const {
  uploadFileCreate,
  deleteFile,
} = require("../../funtions/uploadfilecreate");
const { admin } = require("googleapis/build/src/apis/admin");

exports.create = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = ""; // ตั้งตัวแปรรูป
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        image = reqFiles[0];
      }
      const user = await Hr.findOne({
        Hr_username: req.body.Hr_username,
      });
      if (user) {
        return res
          .status(409)
          .send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.hr_password, salt);
      const hr = new Hr({
        Hr_username: req.body.Hr_username,
        hr_lastname: req.body.hr_lastname,
        hr_name: req.body.hr_name,
        hr_birthday: req.body.hr_birthday,
        hr_email: req.body.hr_email,
        hr_password: hashPassword,
        hr_position: req.body.hr_position,
        hr_phone: req.body.hr_phone,
        image: image,
      });
      const add = await hr.save();
      return res.status(200).send({
        status: true,
        message: "คุณได้สร้างไอดี user เรียบร้อย",
        data: add,
      });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.EditHr = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = ""; // ตั้งตัวแปรรูป
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        }
        image = reqFiles[0];
      }
      const user = await Hr.findOne({
        Hr_username: req.body.Hr_username,
      });
      if (user) {
        return res
          .status(409)
          .send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }
      const id = req.params.id;
      if (!req.body.password) {
        const member = await Hr.findByIdAndUpdate(id, {
          image: image,
        });
      }
      if (!req.body.hr_password) {
        const admin_new = await Hr.findByIdAndUpdate(id, req.body);
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.hr_password, salt);
        const new_passwordadmin = await Hr.findByIdAndUpdate(id, {
          ...req.body,
          hr_password: hashPassword,
        });
      }
      return res
        .status(200)
        .send({ message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.GetHrAll = async (req, res) => {
  try {
    const hr = await Hr.find();
    if (hr) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลสมาชิกสำเร็จ",
        data: hr,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ดึงข้อมูลสมาชิกไม่สำเร็จ", status: false });
    }
  } catch (err) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.getHrById = async (req, res) => {
  try {
    const id = req.params.id;
    const hr = await Hr.findById(id);
    if (!hr) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบผู้ใช้งานในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: hr });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.deleteHr = async (req, res) => {
  try {
    const id = req.params.id;
    const hr = await Hr.findByIdAndDelete(id);
    if (!hr) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบผู้ใช้งานในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อผู้ใช้สำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.deleteHrAll = async (req, res) => {
  try {
    const hr = await Hr.deleteMany();
    if (!hr) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบผู้ใช้งานในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อผู้ใช้สำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};