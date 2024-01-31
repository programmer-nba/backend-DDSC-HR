const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const { Jobposition } = require("../../models/jobposition/jobposition.models");
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
const req = require("express/lib/request");

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
      const job = new Jobposition({
        job_name: req.body.job_name,
        job_location: req.body.job_location,
        job_detail: req.body.job_detail,
        salary: req.body.salary,
        welfare: req.body.welfare,
        contact: req.body.contact,
        posting_date: req.body.posting_date,
        amount_person: req.body.amount_person,
        image: image,
      });
      const add = await job.save();
      return res.status(200).send({
        status: true,
        message: "คุณได้สร้างตำเเหน่งงานเรียบร้อย",
        data: add,
      });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.EditJob = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      // ตรวจสอบข้อผิดพลาดจากการอัปโหลด
      if (err) {
        return res.status(500).send(err);
      }
      const reqFiles = [];
      const result = [];
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        }
      }
      const id = req.params.id;
      const job = await Jobposition.findByIdAndUpdate(id, {
        ...req.body,
        profile_image: reqFiles[0], // หรือใส่ค่าที่คุณต้องการ
      });

      return res.status(200).send({
        message: "แก้ไขผู้ใช้งานนี้เรียบร้อยแล้ว",
        status: true,
      });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
