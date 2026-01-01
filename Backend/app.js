const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes.js');
const videoRoutes = require('./routes/video.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

module.exports = app;
