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
    userAction: {
        type: Array,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);