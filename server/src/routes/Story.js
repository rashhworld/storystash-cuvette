const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const { createStory, downloadStory } = require('../controllers/Story');

router.post('/story/create', verifyToken, createStory);
router.post('/story/download', downloadStory);

module.exports = router;