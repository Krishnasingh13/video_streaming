const mongoose = require('mongoose');

const connectDb = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error('❌ MONGO_URI not set in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri, {
            autoIndex: true,   // optional
        });

        console.log('🚀 Connected to MongoDB:', mongoose.connection.name);

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔁 MongoDB reconnected');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB error:', err);
        });

    } catch (err) {
        console.error(`❌ MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDb;
