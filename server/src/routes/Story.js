const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const { downloadStory } = require('../controllers/Story');

router.post('/story/download', downloadStory);

module.exports = router;