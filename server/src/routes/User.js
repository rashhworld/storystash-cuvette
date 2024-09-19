const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const { validateUser } = require('../middlewares/validateUser');

const { loginUser, registerUser, fetchUser } = require('../controllers/User');

router.get('/user', verifyToken, fetchUser);
router.post('/user/login', validateUser, loginUser);
router.post('/user/register', validateUser, registerUser);

module.exports = router;