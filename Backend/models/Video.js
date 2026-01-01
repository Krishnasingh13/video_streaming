const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    originalFilename: String,
    storedFilename: { type: String, required: true },
    mimeType: String,
    size: Number,
    duration: Number,
    status: {
        type: String,
        enum: ['UPLOADING', 'PROCESSING', 'READY', 'FAILED'],
        default: 'UPLOADING'
    },
    uploadUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: Number, default: 0 }, // 0–100
    categories: [String], // for custom tags
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
