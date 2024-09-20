const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');

const User = require('../models/User');

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

module.exports = { downloadStory };