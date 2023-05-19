require("dotenv").config();
const Mailjet = require('node-mailjet');

// const mailjet = Mailjet.apiConnect(
//   process.env.MAIL_JET_API_KEY,
//   process.env.MAIL_JET_SECRET_KEY,
//   {
//     config: {},
//     options: {}
//   } 
// );

const mailjet = new Mailjet({
  apiKey: process.env.MAIL_JET_API_KEY ,
  apiSecret: process.env.MAIL_JET_SECRET_KEY 
});
//generating otp
exports.generateOTP = () => {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};

//mail sender aoi
exports.mailSender = (to, subject, text, html) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAIL_JET_EMAIL,
          Name: "Behemoth",
        },
        To: [to],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};
