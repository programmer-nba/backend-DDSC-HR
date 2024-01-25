const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const { google } = require("googleapis");
const req = require("express/lib/request.js");
const {
  candidate,
  validateCadidate,
} = require("../../models/candidate/candidate.model");
const multer = require("multer");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    // console.log(file.originalname);
  },
});
async function generatePublicUrl(res) {
  console.log("generatePublicUrl");
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    console.log(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}
//update image
const {
  uploadFileCreate,
  deleteFile,
} = require("../../funtions/uploadfilecreate");

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
        console.log(image)
      }
      const user = await candidate.findOne({
        Candidate_username: req.body.Candidate_username,
      });
      if (user) {
        return res
          .status(409)
          .send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.Candidate_password, salt);
      const member = new candidate({
        Candidate_prefix: req.body.Candidate_prefix,
        Candidate_username: req.body.Candidate_username,
        Candidate_lastname: req.body.Candidate_lastname,
        Candidate_name: req.body.Candidate_name,
        Candidate_idcard: req.body.Candidate_idcard,
        Candidate_birthday: req.body.Candidate_birthday,
        Candidate_email: req.body.Candidate_email,
        Candidate_idcard: req.body.Candidate_idcard,
        Candidate_password: hashPassword,
        Candidate_position: req.body.Candidate_position,
        Candidate_phone: req.body.Candidate_phone,
        image: image,
      });
      const add = await member.save();
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
exports.EditCandidate = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }
    const id = req.params.id;
    if (!req.body.Candidate_password) {
      const candidates = await candidate.findByIdAndUpdate(id, req.body);
      if (candidates) {
        if (candidates) {
          return res
            .status(200)
            .send({ message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true });
        } else {
          return res
            .status(500)
            .send({ message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false });
        }
      }
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.Candidate_password, salt);
      const candidates = await candidate.findByIdAndUpdate(id, {
        ...req.body,
        Candidate_password: hashPassword,
      });
      if (candidates) {
        return res
          .status(200)
          .send({ message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true });
      } else {
        return res
          .status(500)
          .send({ message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.ImportResume = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        }
      }
      const id = req.params.id;
      if (id && !req.body.password) {
        const member = await candidate.findByIdAndUpdate(id, {
          ...req.body,
          Candidate_Resume_img: reqFiles[0],
        });
        if (member) {
          return res.status(200).send({
            message: "เพิ่มรูปภาพเรซูเมสำเร็จ",
            status: true,
          });
        } else {
          return res.status(500).send({
            message: "ไม่สามารถเพิ่มรูปภาพเรซูเมได้",
            status: false,
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.deleteCandidate = async (req, res) => {
  try {
    const id = req.params.id;
    const manager = await candidate.findByIdAndDelete(id);
    if (!manager) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลผู้สมัครสมาชิก" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลผู้สมัครสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.GetCadidateAll = async (req, res) => {
  try {
    const candidates = await candidate.find();
    if (candidates) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลสมาชิกสำเร็จ",
        data: candidates,
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
exports.GetCadidateById = async (req, res) => {
  try {
    const id = req.params.id;
    const candidated = await candidate.findOne({ Candidate_idcard: id });
    if (candidated) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลสมาชิกสำเร็จ",
        data: candidated,
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
