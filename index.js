// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config()

// IMPORTS FROM OTHER FILES
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);





// INIT
const PORT = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use("/auth",authRouter);
app.use("/admin",adminRouter);
app.use("/user",userRouter);

// app.use(`/.api/user`, adminRouter);


// Connections
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Db Successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT,  () => {
  console.log(`connected at port ${PORT}`);
});
