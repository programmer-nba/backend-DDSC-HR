const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const EmployeeSchema = new mongoose.Schema({
  image: { type: String, required: false },
  Employee_Resume_img: {
    type: String,
    required: false,
    default: "เพิ่มรูปภาพ",
  }, //รูปภาพเรซูเม
  Employee_id: { type: String, required: false }, //รหัสสมาชิก
  Employee_username: { type: String, required: false }, //ไอดีสมาชิก
  Employee_password: { type: String, required: false }, //รหัสสมาชิก
  Employee_prefix: { type: String, required: false }, //คำนำหน้า
  Employee_name: { type: String, required: true },
  Employee_lastname: { type: String, required: true },
  Employee_nationality: { type: String, required: true },//สัญชาติ
  Employee_idcard: { type: Number, required: true }, //รหัสบัตรประชาชน
  Employee_birthday: { type: String, required: true }, //วันเกิด
  Employee_Education_History: { type: String, required: true }, //ประวัติการศึกษา
  Employee_Work_Experiences: { type: String, required: true }, //ประวัติการทำงาน
  Employee_email: { type: String, required: false },
  Employee_phone: { type: String, required: true },
  Employee_address: { type: String, required: false },//สถานที่อยู่อาศัยของพนักงาน
  Employee_position: { type: String, required: true },//ตำเเหน่งของพนักงาน
  Employee_note: { type: String, default: "ไม่มี" }, //หมายเหตุ
  Employee_createdby: { type: String, required: false }, //สร้างโดย
  Employee_type: { type: String, required: false, default: "ไม่มี" },
});
const employee = mongoose.model("employee", EmployeeSchema);
const validateEmployee = (data) => {
  const schema = Joi.object({
    Employee_username: Joi.string().required().label("กรุณากรอกไอดีสมาชิก"),
    Employee_password: Joi.string().required().label("กรุณากรอกรหัสผ่านสมาชิก"),
    Employee_name: Joi.string().required().label("กรุณากรอกชื่อ"),
    Employee_lastname: Joi.string().required().label("กรุณากรอกนามสกุล"),
    Employee_phone: Joi.string().required().label("กรอกเบอร์โทรของผู้สมัคร"),
    Employee_address: Joi.string().required().label("กรอกตำแหน่งที่อยุ่พนักงาน"),
    Employee_position: Joi.string().required().label("กรอกตำแหน่งพนักงาน"),
    Employee_idcard: Joi.string()
      .required()
      .label("กรอกเลขบัตรประชาชนของผู้สมัคร"),
    Employee_birthday: Joi.string()
      .required()
      .label("กรอกวันเดือนปีเกิดของผู้สมัคร"),
    Employee_email: Joi.string().required().label("กรอกอีเมล์"),
    Employee_type: Joi.string().required().label("กรอกสถานะประเภทลูกค้า"),
  });
  if ("member_note" in data) {
    delete data.member_note;
  }
  return schema.validateCadidate(data);
};
module.exports = { employee, validateEmployee };
