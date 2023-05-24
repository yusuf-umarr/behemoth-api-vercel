const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");
const Wallet = require("../models/wallet")
const bcryptjs = require("bcryptjs");

const pushNotificationController = require("../controller/push-notification.controller");


// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);



userRouter.get("/", (req, res) => {
  res.json({ "hello":" user netlify!!!!!"})
})


// update user 
userRouter.post("/update-user", auth, async (req, res) => {
  try {
    const { name, email, password, address, profilePic , wallet} = req.body;

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = await User.findById(req.user);
    user.email = email;
    user.name = name;
    user.password = hashedPassword;
    user.profilePic = profilePic;
    user.address = address;
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json( e.message );
  }
});

// get user data

// userRouter.get("/get-user", auth, async (req, res) => {
//   const user = await User.findById(req.user);
//   res.json({ ...user._doc, token: req.token });
// });

// create user-wallet 
userRouter.post("/create-wallet", auth, async (req, res) => {
  try {
    let userWallet = new Wallet({
      amount :0,
      userId: req.user
    });

    userWallet = await userWallet.save();
    res.json(userWallet);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// fund wallet 
userRouter.post("/fund-wallet", auth, async (req, res) => {
  try {

    const { amount} = req.body;

    let wallet = await Wallet.find({userId:req.user});

    let walletId =   wallet[0]._id

    let updateWallet  =  await Wallet.findById(walletId)

    updateWallet.amount += amount;
// 
    updateWallet = await updateWallet.save();
    res.json(updateWallet);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Charge wallet
userRouter.post("/charge-wallet", auth, async (req, res) => {
  try {

    const { amount} = req.body;

    let wallet = await Wallet.find({userId:req.user});

    let walletId =   wallet[0]._id

    let updateWallet  =  await Wallet.findById(walletId)

    updateWallet.amount -= amount;

    updateWallet = await updateWallet.save();
    res.json(updateWallet);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// get wallet 
userRouter.get("/get-wallet", auth, async (req, res) => {
  try {

    let wallet = await Wallet.find({ userId: req.user });
    res.json(wallet);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//get user
userRouter.get("/get-user", async (req, res) => {
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

userRouter.get("/SendNotification", pushNotificationController.SendNotification);
userRouter.post("/SendNotificationToDevice", pushNotificationController.SendNotificationToDevice);

// add one signal id
userRouter.post("/add-onesignal-id", async (req, res) => {
  try {
    const { oneSignalId, email } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      existingUser.oneSignalId =oneSignalId;

      existingUser = await existingUser.save();

      return res.json("oneSignalId added");
    } else{
      return res.status(400).json("User not found." );

    }
  
  } catch (e) {
    res.status(500).json( e.message );
  }
});




module.exports = userRouter;
