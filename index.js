require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();
app.use(express.json());
app.use(cors());

const prefix = "/JobInterview";

app.use(prefix + "/HR", require("./router"));
app.use(prefix + "/admin", require("./router/hr/index"));
app.use(prefix + "/Candidate", require("./router/candidate/index"));


//สร้างรายละเอียดงาน
app.use(prefix + "/job", require("./router/jobposition/index"));
const port = process.env.PORT || 4894;
app.listen(port, console.log(`Listening on port ${port}`));
