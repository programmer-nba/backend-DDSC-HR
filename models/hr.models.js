const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 30,
  lowerCase: 0,
  upperCase: 0,
  numeric: 0,
  symbol: 0,
  requirementCount: 2,
};

const HRchema = new mongoose.Schema({
  hr_name: {type: String, required: true}, //ชื่อ
  Hr_username: {type: String, required: true}, //เลขบัตร
  hr_password: {type: String, required: true}, //รหัส
  hr_position: {type: String, required: true},
});

HRchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {_id: this._id, name: this.hr_name, row: "hr"},
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "4h",
    }
  );
  return token;
};

const Hr = mongoose.model("Hr", HRchema);

const validateHr = (data) => {
  const schema = Joi.object({
    hr_name: Joi.string().required().label("กรุณากรอกชื่อผู้ใช้ด้วย"),
    Hr_username: Joi.string().required().label("กรุณากรอกเลขบัตรผู้ใช้ด้วย"),
    hr_password: passwordComplexity(complexityOptions)
      .required()
      .label("hr_password"),
      hr_position: Joi.string().required().label("กรุณากรอกเลเวลผู้ใช้ด้วย"),
  });
  return schema.validate(data);
};

module.exports = {Hr, validateHr};
