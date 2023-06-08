const express = require("express");
const User = require("../models/user");
const VerificationToken = require("../models/verificationToken")
const Wallet = require("../models/wallet");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { generateOTP, mailSender } = require('../middlewares/utils')
const Inbox = require("../models/inbox")


authRouter.get("/", (req, res) => {
  res.json({ "hello":" hello auth!!!!!"})
})

// SIGN UP
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json( "User with same email already exists!" );
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
    });

    const OTP = generateOTP()
    const hashedOTP = await bcryptjs.hash(OTP, 8);
    let verificationToken =  new VerificationToken({
      owner: user._id,
      token: hashedOTP
    })

    let to = {
      Email: user.email,
      Name: user.name,
    };

    let subject = "Welcome to Behemoth";
    let text = "Please verify your account";
    let html =
      "Hello " +
      user.name +
      ",\n\n" +
      "Please use the bellow OTP code to verify your account.\n" +
      OTP;

   await mailSender(to, subject, text, html);

   let userWallet = new Wallet({
    amount :0,
    userId: user._id
  });

  userWallet = await userWallet.save();



    verificationToken = await verificationToken.save();
    user = await user.save();
    return res.json(user);

    // return res.json({ token, ...existingUser._doc });

  } catch (e) {
    res.status(500).json( e.message );
  }
});


// verify otp
authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { otp, email } = req.body;

    let getVerify;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      getVerify = await VerificationToken.find({owner:existingUser._id});

      // console.log(getVerify[0].token)

      const isMatch = await bcryptjs.compare(otp, getVerify[0].token);
    
      if (!isMatch) {
        return res.status(400).json("Incorrect OTP." );
      }

      existingUser.isVerified =true;

      existingUser = await existingUser.save();
      await VerificationToken.findByIdAndDelete(getVerify[0]._id);

      const token = jwt.sign({ id: existingUser._id }, "passwordKey");

      return res.json({ token, ...existingUser._doc });
    } else{
      return res.status(400).json("User not found." );

    }
  
  } catch (e) {
    res.status(500).json( e.message );
  }
});
// resend otp
authRouter.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    let getVerify;

    let existingUser = await User.findOne({ email });
    if (existingUser) {

      getVerify = await VerificationToken.find({owner:existingUser._id});

      await VerificationToken.findByIdAndDelete(getVerify[0]._id);


      const OTP = generateOTP()
      const hashedOTP = await bcryptjs.hash(OTP, 8);
      let verificationToken =  new VerificationToken({
        owner: existingUser._id,
        token: hashedOTP
      })



      let to = {
        Email: existingUser.email,
        Name: existingUser.name,
      };
  
      let subject = "Behemoth Verification";
      let text = "Please Verify your account";
      let html =
        "Hello " +
        existingUser.name +
        ",\n\n" +
        "Please use the bellow OTP code to verify your account.\n" +
        OTP;

     await mailSender(to, subject, text, html);

      verificationToken = await verificationToken.save();


      return res.json("OTP resent")
    } else{
      return res.status(400).json("User not found." );

    }
  
  } catch (e) {
    res.status(500).json( e.message );
  }
});

// Sign In Route
authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json("User with this email does not exist!" );
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json("Incorrect password." );
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json(e.message );
  }
});

//get user
authRouter.get("/get-user", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
 
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
 
    res.json({ ...user._doc, token });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
authRouter.get("/get-inbox", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
 
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await Inbox.find({userId: verified.id});
 
    res.json({ user, "inbox":token});

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});






// const url = 'https://calling.api.sinch.com/calling/v1/callouts';
// const body = {
//   method: 'ttsCallout',
//   ttsCallout: {
//     cli: '+447520651393',
//     domain: 'pstn',
//     destination: {
//       type: 'number',
//       endpoint: '+2347036456047'
//     },
//     locale: 'en-US',
//     prompts: '#tts[]'
//   }
// };

// const headers = {
//   'Content-Type': 'application/json',
//   'Authorization': 'Basic N2FmNzZjYzAtZmVjOS00NmMwLTkxOTktZDE0Yzg2MjUxM2ExOkpQSEJYVFV1VEUya3pFVk1LS2NsQVE9PQ=='
// };

// authRouter.post("/sinch-call", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json("User with this email does not exist!" );
//     }

//     const isMatch = await bcryptjs.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json("Incorrect password." );
//     }

//     const token = jwt.sign({ id: user._id }, "passwordKey");
//     res.json({ token, ...user._doc });
//   } catch (e) {
//     res.status(500).json(e.message );
//   }
// });


// authRouter.post("/make-call",  async (req, res) => {
//   try {

//     client.calls
//       .create({
//          twiml: '<Response><Say>Ahoy, World!</Say></Response>',
//          to: '+2347036456047',
//          from: '+12546154889'
//        })
//       .then(call => console.log(call.sid));
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });


// authRouter.post("/send-message", auth, async (req, res) => {
//   try {

//     client.messages
//     .create({
//       body: 'Hello from twilio-node',
//       to: '+2347036456047', // Text your number
//       from: '+12546154889', // From a valid Twilio number
//     })
//     .then((message) => console.log(message.sid));
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });





// const ANSWER_URL = 'https://raw.githubusercontent.com/nexmo-community/ncco-examples/gh-pages/text-to-speech.json'


// authRouter.post("/vonage-call", auth, async (req, res) => {
//   try {

//     vonage.voice.createOutboundCall({
//       to: [{
//         type: 'phone',
//         number: +2347036456047
//       }],
//       from: {
//         type: 'phone',
//         number: VONAGE_NUMBER
//       },
//       answer_url: [ANSWER_URL]
//     })
//       .then(resp => console.log(resp))
//       .catch(err => console.error(err));
  
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });







module.exports = authRouter;
