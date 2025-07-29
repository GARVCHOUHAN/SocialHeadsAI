

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tokenSchema = new mongoose.Schema({
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiryDate: { type: Number },
    scopes: [String],
});

// NEW: Schema to store personalized insights
const insightsSchema = new mongoose.Schema({
    titlePatterns: [{
        patternType: String, // e.g., 'question', 'list_number', 'keyword'
        effectiveness: Number, // e.g., 0.15 for 15% higher CTR
        example: String,
    }],
    thumbnailPatterns: [{
        patternType: String, // e.g., 'dominant_color', 'face_emotion'
        value: String, // e.g., 'yellow', 'surprise'
        frequency: Number, // e.g., 0.8 for 8 out of 10
    }],
    lastUpdatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    connections: {
        youtube: tokenSchema,
    },
    insights: insightsSchema, // ADD THIS NEW FIELD
}, { timestamps: true });

// ... (rest of the file remains the same)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
