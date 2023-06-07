const mongoose = require('mongoose')


const inboxSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
    
},
);


const Inbox = mongoose.model("Inbox", inboxSchema);
module.exports = Inbox;
