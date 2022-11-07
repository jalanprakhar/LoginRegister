require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://localhost:27017/NetworkSecurity`)
  .then(() => {
    console.log("Connection successfull");
  })
  .catch((e) => {
    console.log(e);
  });
