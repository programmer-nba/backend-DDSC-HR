const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const CandidateSchema = new mongoose.Schema({
  image: { type: String, required: false },
  Candidate_Resume_img: {
    type: String,
    required: false,
    default: "เพิ่มรูปภาพ",
  }, //รูปภาพเรซูเม
  Candidate_id: { type: String, required: false }, //รหัสสมาชิก
  Candidate_username: { type: String, required: false }, //ไอดีสมาชิก
  Candidate_password: { type: String, required: false }, //รหัสสมาชิก
  Candidate_prefix: { type: String, required: false }, //คำนำหน้า
  Candidate_name: { type: String, required: true },
  Candidate_lastname: { type: String, required: true },
  Candidate_nationality: { type: String, required: true }, //สัญชาติ
  Candidate_idcard: { type: Number, required: true }, //รหัสบัตรประชาชน
  Candidate_birthday: { type: String, required: true }, //วันเกิด
  Candidate_Education_History: {
    type: String,
    required: false,
  }, //ประวัติการศึกษา
  Candidate_Work_Experiences: {
    type: String,
    required: true,
    default: "ไม่มีประสบการ์ณการทำงานมาก่อน",
  }, //ประวัติการทำงาน
  Candidate_position_need: { type: String, required: true }, //ตำเเหน่งที่ต้องการสมัคร
  Candidate_email: { type: String, required: false },
  Candidate_phone: { type: String, required: true },
  Candidate_position: { type: String, required: true },
  Candidate_note: { type: String, default: "ไม่มี" }, //หมายเหตุ
  Candidate_createdby: { type: String, required: false }, //สร้างโดย
  Candidate_status: { type: Array, required: false }, //เก็บข้อมูลว่าสัมภาษณ์ หรือไม่
  Candidate_type: { type: String, required: false, default: "ไม่มี" },
});
const candidate = mongoose.model("candidate", CandidateSchema);
const validateCadidate = (data) => {
  const schema = Joi.object({
    Candidate_username: Joi.string().required().label("กรุณากรอกไอดีสมาชิก"),
    Candidate_password: Joi.string()
      .required()
      .label("กรุณากรอกรหัสผ่านสมาชิก"),
    Candidate_nationality: Joi.string().required().label("กรุณากรอกสัญชาติ"),
    Candidate_name: Joi.string().required().label("กรุณากรอกชื่อ"),
    Candidate_lastname: Joi.string().required().label("กรุณากรอกนามสกุล"),
    Candidate_Education_History: Joi.string()
      .required()
      .label("กรุณากรอกประวัติการศึกษา"),
    Candidate_Work_Experiences: Joi.string()
      .required()
      .label("กรุณากรอกประวัติการทำงาน"),
    Candidate_phone: Joi.string().required().label("กรอกเบอร์โทรของผู้สมัคร"),
    Candidate_position: Joi.string().required().label("กรอกตำแหน่งที่อยู่"),
    Candidate_idcard: Joi.string()
      .required()
      .label("กรอกเลขบัตรประชาชนของผู้สมัคร"),
    Candidate_birthday: Joi.string()
      .required()
      .label("กรอกวันเดือนปีเกิดของผู้สมัคร"),
    Candidate_position_need: Joi.string()
      .required()
      .label("กรอกตำเเหน่งที่ต้องการสมัคร"),
    Candidate_email: Joi.string().required().label("กรอกอีเมล์"),
    Candidate_type: Joi.string().required().label("กรอกสถานะประเภทลูกค้า"),
  });
  if ("member_note" in data) {
    delete data.member_note;
  }
  return schema.validateCadidate(data);
};
module.exports = { candidate, validateCadidate };
