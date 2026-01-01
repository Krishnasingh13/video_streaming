// config/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const VIDEO_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'videos');

// Ensure upload dir exists
if (!fs.existsSync(VIDEO_UPLOAD_DIR)) {
    fs.mkdirSync(VIDEO_UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, VIDEO_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${uniqueSuffix}${ext}`);
    },
});

const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/mkv',
    'video/x-matroska',
];

const fileFilter = (req, file, cb) => {
    if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported video format'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
    fileFilter,
});

module.exports = {
    upload,
    VIDEO_UPLOAD_DIR,
    ALLOWED_VIDEO_TYPES,
};
