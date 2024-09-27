const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userPass: {
        type: String,
        required: true,
    },
    userAction: [
        {
            storyId: { type: mongoose.ObjectId, ref: 'Story' },
            like: { type: [Number], default: [0] },
            bookmark: { type: [Number], default: [0] }
        }
    ]
});

module.exports = mongoose.model('User', userSchema);