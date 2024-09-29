const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const User = require('../models/User');
const Story = require('../models/Story');

const validateStoryData = async (storyId) => {
    if (!ObjectId.isValid(storyId)) {
        throw { message: "This is not a valid Story, please check your URL.", code: 400 };
    }

    const storyData = await Story.findById(storyId);
    if (!storyData) {
        throw { message: "This is not a valid Story, please check your URL.", code: 404 };
    }

    return storyData;
};

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

const fetchUserStory = async (req, res, next) => {
    try {
        const results = await Story.aggregate([
            { $match: { userId: new ObjectId(req.user) } },
            { $unwind: '$slides' },
            {
                $group: {
                    _id: '$_id',
                    slide: { $first: '$slides' }
                }
            }
        ]);

        res.status(200).json({ status: "success", data: results });
    } catch (err) {
        next(err);
    }
};

const fetchUserBookmark = async (req, res, next) => {
    try {
        const user = await User.findById(req.user, { userAction: 1 });
        const bookmarks = user.userAction
            .filter(action => action.bookmark.length > 0)
            .map(action => ({
                storyId: action.storyId,
                bookmarks: action.bookmark
            }));

        const finalResult = [];
        await Promise.all(bookmarks.map(async (b) => {
            const stories = await Story.find({ _id: b.storyId });
            stories.forEach(story => {
                const matchedSlides = b.bookmarks.map(index => story.slides[index]).filter(slide => slide);
                matchedSlides.forEach(slide => {
                    finalResult.push({
                        _id: story._id,
                        slide: slide
                    });
                });
            });
        }));

        res.status(200).json({ status: "success", data: finalResult });
    } catch (err) {
        next(err);
    }
};

// const saveUserAction = async (req, res, next) => {
//     try {
//         const userId = req.user;
//         const { storyId, userAction } = req.body;

//         await validateStoryData(storyId);

//         const result = await User.findOneAndUpdate(
//             { _id: userId, 'userAction.storyId': storyId },
//             {
//                 $set: {
//                     'userAction.$.like': userAction.like,
//                     'userAction.$.bookmark': userAction.bookmark
//                 }
//             },
//             { new: true }
//         );

//         if (!result) {
//             await User.findByIdAndUpdate(
//                 { _id: userId },
//                 {
//                     $push: {
//                         userAction: {
//                             storyId,
//                             like: userAction.like,
//                             bookmark: userAction.bookmark
//                         }
//                     }
//                 },
//             );
//         }

//         res.status(200).json({ status: "success", data: "" });
//     } catch (err) {
//         next(err);
//     }
// };

const saveUserAction = async (req, res, next) => {
    try {
        const userId = req.user;
        const { type, storyId, slideId } = req.body;

        await validateStoryData(storyId);
        const user = await User.findById(userId);

        let userAction = user.userAction.find(action => action.storyId.toString() === storyId);
        if (!userAction) {
            userAction = {
                storyId,
                like: type === 'like' ? [slideId] : [],
                bookmark: type === 'bookmark' ? [slideId] : [],
            };
            user.userAction.push(userAction);
        } else {
            const actionsArray = userAction[type];
            const slideIndex = actionsArray.indexOf(slideId);

            if (slideIndex !== -1) actionsArray.splice(slideIndex, 1);
            else actionsArray.push(slideId);
        }

        await user.save();
        res.status(200).json({ status: "success", data: "" });
    } catch (err) {
        next(err);
    }
}

const fetchUserAction = async (req, res, next) => {
    try {
        const { storyId } = req.params;
        await validateStoryData(storyId);

        const user = await User.findById(req.user, { userAction: { $elemMatch: { storyId } } });
        const userAction = user.userAction[0];
        const response = {
            like: userAction ? userAction.like : [],
            bookmark: userAction ? userAction.bookmark : []
        };
        res.status(200).json({ status: "success", data: response });
    } catch (err) {
        next(err);
    }
}

module.exports = { loginUser, registerUser, fetchUser, fetchUserStory, fetchUserBookmark, saveUserAction, fetchUserAction };