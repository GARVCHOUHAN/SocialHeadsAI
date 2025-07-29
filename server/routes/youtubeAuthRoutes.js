


import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

router.get('/connect/youtube', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(401).send('Authentication token is missing.');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/yt-analytics.readonly', 'https://www.googleapis.com/auth/yt-analytics-monetary.readonly'],
            state: decoded.id
        });
        res.redirect(authUrl);
    } catch (error) {
        res.status(401).send('Unauthorized: Invalid token.');
    }
});

router.get('/callback/youtube', async (req, res) => {
    const { code, state: userId } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        if (!tokens.refresh_token) {
            return res.redirect(`${frontendUrl}/dashboard?error=refresh_token_missing`);
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).redirect(`${frontendUrl}/login?error=UserNotFound`);
        user.connections.youtube = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiryDate: tokens.expiry_date,
            scopes: tokens.scope.split(' '),
        };
        await user.save();
        res.redirect(`${frontendUrl}/dashboard?success=youtube_connected`);
    } catch (error) {
        res.redirect(`${frontendUrl}/dashboard?error=oauth_failed`);
    }
});
export default router;
