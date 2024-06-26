const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
    path: {
        type: String,
        required: true,
        unique: true,
    },
    for: {
        type: Number,
        default: 0
    },
    against: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Image", ImageSchema);