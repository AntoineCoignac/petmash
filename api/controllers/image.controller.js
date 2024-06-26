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
