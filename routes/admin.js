const express = require("express");
const adminRouter = express.Router();

var admin = require("firebase-admin");
require('dotenv').config()


var serviceAccount = require("../whoueep-31034-firebase-adminsdk-2yepb-d5e63fd993.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// require("dotenv").config();
// const Mailjet = require('node-mailjet');


// const mailjet = new Mailjet({
//   apiKey: process.env.MAIL_JET_API_KEY ,
//   apiSecret: process.env.MAIL_JET_SECRET_KEY 
// });

// const {  mailSender } = require('../middlewares/utils')




adminRouter.get("/", (req, res) => {
  res.json({ "hello":" admin user!"})
})

app.post("/send", function (req, res) {
  const receivedToken = req.body.fcmToken;
  
  const message = {
    notification: {
      title: "Notif",
      body: 'This is a Test Notification'
    },
    token: receivedToken,
  };
  
  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
  
  
});


// mailSender = async(user1,user2,  subject, text, html) => {

//   try {
//     const request = await  mailjet.post("send", { version: "v3.1" }).request({
//       Messages: [
//         {
//           From: {
//             Email: "yusuf.umar@academicianhelp.com",
//             Name: "Behemoth",
//           },
//           To: [user1, user2],
//           Subject: subject,
//           TextPart: text,
//           HTMLPart: html,
//           CustomID: "AppGettingStartedTest",
//         },
//       ],
//     });
//     return console.log("successful");

    
//   } catch (e) {
//     return console.log(e);

    
//   }


// };


// adminRouter.post("/", async (req, res) => {

//   const { name, mail1, mail2 } = req.body;



//   let user1 = {
//     Email: mail1,
//   };
//   let user2 = {
//     Email: mail2,
//   };

//   let subject = "account issue login ";
//   let text = "account error text from user";
//   let html =
//     "Hello user, i am having issue login to my account" ;

//  await mailSender(user1, user2, subject, text, html);

//   res.json( "done")
// })


module.exports = adminRouter;
