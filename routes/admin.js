const express = require("express");
const adminRouter = express.Router();




adminRouter.get("/", (req, res) => {
  res.json({ "hello":" admin netlify user!!!!!"})
})


module.exports = adminRouter;
