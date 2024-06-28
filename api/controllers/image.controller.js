const Image = require("../models/image.model.js");
const createError = require("../utils/createError.js");

const getRandomImages = async (req, res, next) => {
    try {
        const count = await Image.countDocuments();

        if (count < 2) {
            return next(createError(400, 'Not enough images in the database'));
        }

        let randomIndices = new Set();
        while (randomIndices.size < 2) {
            randomIndices.add(Math.floor(Math.random() * count));
        }

        const randomIndicesArray = Array.from(randomIndices);

        const randomImages = await Promise.all([
            Image.findOne().skip(randomIndicesArray[0]),
            Image.findOne().skip(randomIndicesArray[1])
        ]);

        res.status(200).json(randomImages);
    } catch (err) {
        next(err);
    }
};

const getLeaderboard = async (req, res, next) => {
    try {
        const images = await Image.find().sort({ score: -1 });

        res.status(200).json(images);
    } catch (err) {
        next(err);
    }
};

const getRank = async (imageId) => {
    const images = await Image.find().sort({ score: -1 });
    return images.findIndex(image => image._id.equals(imageId)) + 1;
};

const vote = async (req, res, next) => {
    try {
        const imageFor = await Image.findById(req.body.for);
        const imageAgainst = await Image.findById(req.body.against);

        if (!imageFor || !imageAgainst) {
            return next(createError(404, 'One or both images not found'));
        }

        const imageForRank = await getRank(imageFor._id);
        const imageAgainstRank = await getRank(imageAgainst._id);

        imageFor.for += 1;
        imageAgainst.against += 1;

        imageFor.score = imageFor.for - imageFor.against;
        imageAgainst.score = imageAgainst.for - imageAgainst.against;

        if (imageFor.score < 0) {
            imageFor.score = 0;
        }
        if (imageAgainst.score < 0) {
            imageAgainst.score = 0;
        }

        await imageFor.save();
        await imageAgainst.save();

        const imageForNewRank = await getRank(imageFor._id);
        const imageAgainstNewRank = await getRank(imageAgainst._id);

        res.status(200).json({
            forId: imageFor._id,
            forDiff: imageForRank - imageForNewRank,
            againstId: imageAgainst._id,
            againstDiff: imageAgainstRank - imageAgainstNewRank
        });
    } catch (err) {
        next(err);
    }
};

const newImage = async (req, res, next) => {
    try {
        const { path } = req.body;

        if (!path) {
            return next(createError(400, 'Image path is required'));
        }

        const newImage = new Image({ path });

        await newImage.save();

        res.status(201).json(newImage);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getRandomImages,
    getLeaderboard,
    vote,
    newImage
};