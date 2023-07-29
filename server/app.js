require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const cors = require("cors");
const router = require("./routes/router")
const PORT = 5004;

app.use(cors());
app.use(express.json());
app.use(router);


//server start
app.listen(PORT, () => {
  console.log(`server start at ${PORT}`);
});
