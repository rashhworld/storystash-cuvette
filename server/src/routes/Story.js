const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const { fetchStoryById, fetchStoryByCategory, createStory, updateSlideLike, downloadStory } = require('../controllers/Story');

router.post('/story', fetchStoryById);
router.post('/story/create', verifyToken, createStory);
router.post('/story/category', fetchStoryByCategory);
router.post('/story/slide/like', verifyToken, updateSlideLike);
router.post('/story/download', downloadStory);

module.exports = router;