const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const JobPositionSchema = new mongoose.Schema({
  image: { type: String, required: false }, //ภาพบริษัท
  job_name: { type: String, required: false }, //ชื่อตำเเหน่งงาน
  job_location: { type: String, required: false }, //สถานที่ตั้งของบริษัท
  job_detail: { type: String, required: false }, //รายละเอียดเกี่ยวกับงาน
  salary: { type: String, required: false }, //เงินเดือน
  welfare: { type: String, required: false }, //สวัดดีการ
  contact: { type: String, required: false }, //ติดต่อ
  posting_date: { type: String, required: false }, //วันที่ประกาศ
  amount_person: { type: Number, required: false }, //จำนวนคนที่รับ
});
const Jobposition = mongoose.model("Jobposition", JobPositionSchema);
module.exports = { Jobposition };
