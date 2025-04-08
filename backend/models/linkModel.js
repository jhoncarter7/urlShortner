import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    clickCount: { type: Number, default: 0 },
    analytics: [{
        timestamp: { type: Date, default: Date.now },
        ipAddress: String,
        userAgent: String,
    }]
});

const Link = mongoose.model('Link', linkSchema);

export default Link;