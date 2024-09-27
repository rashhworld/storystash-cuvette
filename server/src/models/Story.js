const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: 'User', 
        required: true,
    },
    slides: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Story', storySchema);