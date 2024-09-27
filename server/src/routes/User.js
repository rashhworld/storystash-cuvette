const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const { validateUser } = require('../middlewares/validateUser');

const { loginUser, registerUser, fetchUser, fetchUserStory, saveUserAction, fetchUserAction } = require('../controllers/User');

router.get('/user', verifyToken, fetchUser);
router.post('/user/login', validateUser, loginUser);
router.post('/user/register', validateUser, registerUser);
router.get('/user/story', verifyToken, fetchUserStory);
router.post('/user/action', verifyToken, saveUserAction);
router.get('/user/action/:storyId', verifyToken, fetchUserAction);

module.exports = router;