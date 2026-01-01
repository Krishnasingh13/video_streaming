// controllers/videoController.js
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');
const { VIDEO_UPLOAD_DIR, ALLOWED_VIDEO_TYPES } = require('../config/multerConfig');

const ROLES = {
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
    VIEWER: 'VIEWER',
};


// ---- RBAC helpers ----
function canManageVideo(user, video) {
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true;
    if (user.role === ROLES.EDITOR && String(video.uploadUser) === String(user.id)) {
        return true;
    }
    return false;
}

function canViewVideo(user, video) {
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true;
    // Simple per-user isolation; you can later add "assigned videos" logic for viewers
    if (String(video.uploadUser) === String(user.id)) return true;
    return false;
}

// ---- Controller methods ----

/**
 * POST /api/videos
 * Upload a new video
 */
exports.uploadVideo = async (req, res) => {
    try {
        const user = req.user;

        console.log("user 43", user, ROLES);

        if (!user || (user.role !== ROLES.EDITOR && user.role !== ROLES.ADMIN)) {
            return res.status(403).json({ message: 'Not authorised to upload videos' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Video file is required' });
        }

        const {
            originalname,
            mimetype,
            size,
            filename, // from multer.diskStorage
            path: filePath, // absolute path, we won’t store it in DB
        } = req.file;

        const { title, description, categories } = req.body;

        if (!ALLOWED_VIDEO_TYPES.includes(mimetype)) {
            fs.unlink(filePath, () => { });
            return res.status(400).json({ message: 'Unsupported video format' });
        }

        // Model defaults: status = 'UPLOADING', sensitivityStatus = 'PENDING', progress = 0
        const video = await Video.create({
            title: title || originalname,
            description: description || '',
            originalFilename: originalname,
            storedFilename: filename,
            mimeType: mimetype,
            size,
            uploadUser: user.id,
            categories: categories
                ? (Array.isArray(categories)
                    ? categories
                    : categories.split(',').map(c => c.trim()))
                : [],
        });

        // Start async processing pipeline
        const io = req.app.get('io'); // make sure you set this in your main app
        processVideoPipeline(video._id, io).catch(err => {
            console.error('Video processing failed:', err);
        });

        return res.status(201).json({
            message: 'Video uploaded successfully. Processing started.',
            videoId: video._id,
            video,
        });
    } catch (err) {
        console.error('uploadVideo error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/videos
 * List videos with basic filtering
 */
exports.listVideos = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }

        const {
            status,              // UPLOADING / PROCESSING / READY / FAILED
            sensitivity,         // PENDING / SAFE / FLAGGED
            search,              // title/description
            fromDate,
            toDate,
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};

        // Simple multi-tenant: admin sees all, others see only their own
        if (user.role !== ROLES.ADMIN) {
            query.uploadUser = user.id;
        }

        if (status) query.status = status;
        if (sensitivity) query.sensitivityStatus = sensitivity;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const [videos, total] = await Promise.all([
            Video.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            Video.countDocuments(query),
        ]);

        return res.json({
            data: videos,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (err) {
        console.error('listVideos error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/videos/:id
 * Get single video metadata
 */
exports.getVideoById = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        if (!canViewVideo(user, video)) {
            return res.status(403).json({ message: 'Not authorised to view this video' });
        }

        return res.json(video);
    } catch (err) {
        console.error('getVideoById error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/videos/:id/stream
 * HTTP range-based streaming using storedFilename
 */
// exports.streamVideo = async (req, res) => {
//     try {
//         const user = req.user;
//         const { id } = req.params;

//         const video = await Video.findById(id);
//         if (!video) {
//             return res.status(404).json({ message: 'Video not found' });
//         }

//         if (!canViewVideo(user, video)) {
//             return res.status(403).json({ message: 'Not authorised to stream this video' });
//         }

//         const filePath = path.join(VIDEO_UPLOAD_DIR, video.storedFilename);

//         if (!fs.existsSync(filePath)) {
//             return res.status(404).json({ message: 'Video file not found on server' });
//         }

//         const stat = fs.statSync(filePath);
//         const fileSize = stat.size;
//         const range = req.headers.range;

//         if (!range) {
//             // send entire file
//             res.writeHead(200, {
//                 'Content-Length': fileSize,
//                 'Content-Type': video.mimeType || 'video/mp4',
//             });
//             fs.createReadStream(filePath).pipe(res);
//             return;
//         }

//         const parts = range.replace(/bytes=/, '').split('-');
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

//         if (start >= fileSize || end >= fileSize) {
//             res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
//             return res.end();
//         }

//         const chunkSize = end - start + 1;
//         const file = fs.createReadStream(filePath, { start, end });

//         res.writeHead(206, {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunkSize,
//             'Content-Type': video.mimeType || 'video/mp4',
//         });

//         file.pipe(res);
//     } catch (err) {
//         console.error('streamVideo error:', err);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };


exports.streamVideo = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        // 1. Find video metadata
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // 2. Authorisation
        if (!canViewVideo(user, video)) {
            return res.status(403).json({ message: 'Not authorised to stream this video' });
        }

        // 3. Resolve file path on disk
        const filePath = path.join(VIDEO_UPLOAD_DIR, video.storedFilename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Video file not found on server' });
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;

        // 4. Client must send Range header for chunked streaming
        const range = req.headers.range;
        if (!range) {
            // Option A: send error
            // return res.status(416).json({ message: 'Range header required' });

            // Option B: send entire file (fallback)
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': video.mimeType || 'video/mp4',
            });
            fs.createReadStream(filePath).pipe(res);
            return;
        }

        // Example header: "bytes=0-" or "bytes=1000000-2000000"
        const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB per chunk
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);

        // If client specified an end, use it, but cap at CHUNK_SIZE
        let end = parts[1]
            ? parseInt(parts[1], 10)
            : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

        if (end >= fileSize) {
            end = fileSize - 1;
        }

        // Sanity check
        if (start >= fileSize || start < 0) {
            res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
            return res.end();
        }

        const contentLength = end - start + 1;

        // 5. Response headers for partial content
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': video.mimeType || 'video/mp4',
        });

        // 6. Stream the chunk
        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
    } catch (err) {
        console.error('streamVideo error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


/**
 * PATCH /api/videos/:id
 * Update simple metadata / categories
 */
exports.updateVideo = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { title, description, categories } = req.body;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        if (!canManageVideo(user, video)) {
            return res.status(403).json({ message: 'Not authorised to update this video' });
        }

        if (title !== undefined) video.title = title;
        if (description !== undefined) video.description = description;
        if (categories !== undefined) {
            video.categories = Array.isArray(categories)
                ? categories
                : categories.split(',').map(c => c.trim());
        }

        await video.save();
        return res.json({ message: 'Video updated', video });
    } catch (err) {
        console.error('updateVideo error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * DELETE /api/videos/:id
 */
exports.deleteVideo = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        if (!canManageVideo(user, video)) {
            return res.status(403).json({ message: 'Not authorised to delete this video' });
        }

        const filePath = path.join(VIDEO_UPLOAD_DIR, video.storedFilename);
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, () => { });
        }

        await video.deleteOne();

        return res.json({ message: 'Video deleted' });
    } catch (err) {
        console.error('deleteVideo error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// ---- Processing pipeline ----

async function processVideoPipeline(videoId, io) {
    const video = await Video.findById(videoId);
    if (!video) return;

    // Move from UPLOADING -> PROCESSING
    video.status = 'PROCESSING';
    video.progress = 10;
    await video.save();
    emitProgress(io, video, 'Processing started');

    // Here you’d run FFmpeg for duration / optimisation
    // For now we simulate with delays:
    await delay(800);
    video.progress = 30;
    await video.save();
    emitProgress(io, video, 'Validating video format');

    await delay(800);
    video.progress = 60;
    await video.save();
    emitProgress(io, video, 'Running sensitivity analysis');

    await delay(800);
    video.progress = 90;
    await video.save();
    emitProgress(io, video, 'Finalising');

    // DONE
    video.status = 'READY';
    video.progress = 100;
    await video.save();
    emitProgress(io, video, 'Processing completed');
}

function emitProgress(io, video, message) {
    if (!io) return;
    io.to(`video-${video._id}`).emit('video-processing-progress', {
        videoId: video._id,
        progress: video.progress,
        status: video.status,
        message,
    });
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

