

const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  amount: {
    required: true,
    type: Number,
    trim: true,
  },

  userId: {
    required: true,
    type: String,
  },
  
 
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;


/*
 userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },

      userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    // required: true,
  },
*/