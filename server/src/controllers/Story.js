const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');

const Story = require('../models/Story');

const createStory = async (req, res, next) => {
    try {
        const userId = req.user;
        const { storyData } = req.body;


        res.status(200).json({ status: "success", msg: "Story created successfully." });
    } catch (err) {
        next(err);
    }
};

const downloadStory = async (req, res, next) => {
    const { source } = req.body;
    try {
        const response = await axios({ url: source, method: 'GET', responseType: 'stream' });
        res.setHeader('Content-Disposition', 'attachment');
        response.data.pipe(res);
    } catch (err) {
        next(err);
    }
};

module.exports = { createStory, downloadStory };