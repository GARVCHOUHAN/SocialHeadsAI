
import express from 'express';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const dashRouter = express.Router();

export const getAuthenticatedClient = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found.');
    const youtubeConnection = user.connections?.youtube;
    if (!youtubeConnection?.refreshToken) {
        throw new Error('YouTube account not connected or refresh token is missing.');
    }
    const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oAuth2Client.setCredentials({ refresh_token: youtubeConnection.refreshToken });
    try {
        const { token: newAccessToken } = await oAuth2Client.getAccessToken();
        if (newAccessToken !== youtubeConnection.accessToken) {
            user.connections.youtube.accessToken = newAccessToken;
            user.connections.youtube.expiryDate = oAuth2Client.credentials.expiry_date;
            await user.save();
        }
    } catch (refreshError) {
        console.error('Could not refresh access token:', refreshError.response?.data);
        throw new Error('Your authentication with Google has expired or been revoked. Please reconnect your account.');
    }
    return oAuth2Client;
};

// This endpoint now fetches BOTH basic and advanced data in a resilient way.
dashRouter.get('/youtube-dashboard-data', protect, async (req, res) => {
    let basicInfo = null;
    let advancedAnalytics = null;
    let analyticsError = null;

    try {
        const oAuth2Client = await getAuthenticatedClient(req.user.id);
        const accessToken = oAuth2Client.credentials.access_token;

        // --- Step 1: Fetch Basic Channel Info (Subscribers, Total Views) ---
        // This call usually succeeds and provides immediate value.
        const dataApiUrl = 'https://www.googleapis.com/youtube/v3/channels';
        const basicResponse = await axios.get(dataApiUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { part: 'snippet,statistics', mine: true },
        });
        if (basicResponse.data.items && basicResponse.data.items.length > 0) {
            basicInfo = basicResponse.data.items[0];
        } else {
            throw new Error('Could not find YouTube channel for this account.');
        }

        // --- Step 2: Attempt to Fetch Advanced Analytics ---
        try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const analyticsApiUrl = 'https://youtubeanalytics.googleapis.com/v2/reports';
            const analyticsResponse = await axios.get(analyticsApiUrl, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { ids: 'channel==MINE', startDate, endDate, metrics: 'views,subscribersGained,estimatedRevenue', dimensions: 'day', sort: 'day' },
            });
            const rows = analyticsResponse.data.rows || [];
            let totalViews = 0, totalRevenue = 0, totalSubscribersGained = 0;
            rows.forEach(row => {
                totalViews += row[1] || 0;
                totalSubscribersGained += row[2] || 0;
                totalRevenue += row[3] || 0;
            });
            const reachGraphData = rows.map(row => ({ date: row[0], views: row[1] || 0 }));
            advancedAnalytics = {
                kpi: { reach: totalViews, followersGained: totalSubscribersGained, revenue: totalRevenue },
                reachGraph: reachGraphData,
            };
        } catch (error) {
            // If this specific call fails, we catch it, log it, and set an error message.
            // The overall request will still succeed because we have the basic info.
            if (error.response && error.response.status === 403) {
                 analyticsError = 'The YouTube Analytics API is not enabled for your project or is misconfigured. Basic stats are available.';
                 console.error('[HANDLED ERROR] YouTube Analytics API is not enabled. Check Google Cloud Console.');
            } else {
                analyticsError = 'Could not load advanced analytics for this period.';
                console.error('[HANDLED ERROR] Could not fetch advanced analytics:', error.message);
            }
        }

        // Send a successful response containing all the data we managed to get.
        res.json({
            basicInfo,
            advancedAnalytics,
            analyticsError,
        });

    } catch (error) {
        // This outer catch block handles critical failures (e.g., bad refresh token).
        const errorMessage = error.message;
        console.error('Critical error in dashboard data fetch:', errorMessage);
        if (errorMessage.includes('revoked')) {
            return res.status(401).json({ message: errorMessage });
        }
        res.status(500).json({ message: errorMessage });
    }
});

export { dashRouter };
