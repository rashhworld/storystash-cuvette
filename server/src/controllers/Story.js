const axios = require('axios');
const Story = require('../models/Story');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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

const fetchStoryById = async (req, res, next) => {
    try {
        const { storyId } = req.body;
        const data = await validateStoryData(storyId);
        res.status(200).json({ status: "success", data: data.slides });
    } catch (err) {
        next(err);
    }
};

const fetchStoryByCategory = async (req, res, next) => {
    try {
        const { category } = req.body;

        const results = await Story.aggregate([
            { $match: { 'slides.category': category } },
            { $unwind: '$slides' },
            { $match: { 'slides.category': category } },
            {
                $group: {
                    _id: '$_id',
                    firstSlide: { $first: '$slides' }
                }
            }
        ]);

        res.status(200).json({ status: "success", data: results });
    } catch (err) {
        next(err);
    }
};

const createStory = async (req, res, next) => {
    try {
        const userId = req.user;
        const storyData = req.body;

        await Story.create({ userId, slides: storyData });
        res.status(200).json({ status: "success", msg: "Story created successfully." });
    } catch (err) {
        next(err);
    }
};

const updateSlideLike = async (req, res, next) => {
    try {
        const { storyId, slideId, like } = req.body;
        const story = await validateStoryData(storyId);

        if (slideId < 0 || slideId >= story.slides.length)
            throw { message: "Slide not found.", code: 404 };

        story.slides[slideId].likes += like;
        story.markModified('slides');
        const updatedStory = await story.save();
        const updatedLike = updatedStory.slides[slideId].likes;

        res.status(200).json({ status: "success", data: updatedLike });
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

module.exports = { fetchStoryById, fetchStoryByCategory, createStory, updateSlideLike, downloadStory };