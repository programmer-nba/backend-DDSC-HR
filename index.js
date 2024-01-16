require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();

app.use(express.json());
app.use(cors());






const port = process.env.PORT || 4894;
app.listen(port, console.log(`Listening on port ${port}`));