const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const bcryptjs = require("bcryptjs");

const jwt = require('jsonwebtoken')

const verificationTokenSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
    
},
);



module.exports = mongoose.model('VerificationToken', verificationTokenSchema)