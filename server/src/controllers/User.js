const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const loginUser = async (req, res, next) => {
    try {
        const { userName, userPass } = req.body;
        const userdata = await User.findOne({ userName });

        if (userdata) {
            if (await bcrypt.compare(userPass, userdata.userPass)) {
                const token = jwt.sign({ uid: userdata._id }, process.env.JWT_SECRET);
                res.status(200).json({ status: "success", msg: "Login successful.", token });
            } else {
                throw Object.assign(Error("Wrong password entered."), { code: 401 });
            }
        } else {
            throw Object.assign(Error("No user found with this username."), { code: 404 });
        }
    } catch (err) {
        next(err);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const { userName, userPass } = req.body;
        if (await User.findOne({ userName })) {
            throw Object.assign(Error("Username already taken, try another."), { code: 409 });
        } else {
            const hashedPassword = await bcrypt.hash(userPass, 10);
            const userdata = await User.create({ userName, userPass: hashedPassword });
            const token = jwt.sign({ uid: userdata._id }, process.env.JWT_SECRET);
            res.status(200).json({ status: "success", msg: "Registred successfully.", token });
        }
    } catch (err) {
        next(err);
    }
};

const fetchUser = async (req, res, next) => {
    try {
        const userdata = await User.findOne({ _id: req.user });
        res.status(200).json({ status: "success", data: userdata });
    } catch (err) {
        next(err);
    }
};

module.exports = { loginUser, registerUser, fetchUser };