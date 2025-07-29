import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// STEP 1: Redirect the user to Facebook's Login Dialog
router.get('/connect/instagram', protect, (req, res) => {
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.META_REDIRECT_URI}&state=${req.user.id}&scope=pages_show_list,instagram_basic,instagram_manage_insights,pages_read_engagement`;
    res.redirect(authUrl);
});

// STEP 2: Facebook redirects back to this URL with a code
router.get('/callback/instagram', async (req, res) => {
    const { code, state: userId } = req.query;

    if (!code) {
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=instagram_auth_failed`);
    }

    try {
        // Exchange code for a short-lived access token
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.META_REDIRECT_URI}&client_secret=${process.env.META_APP_SECRET}&code=${code}`;
        const tokenResponse = await axios.get(tokenUrl);
        const shortLivedToken = tokenResponse.data.access_token;

        // Exchange short-lived token for a long-lived token
        const longLivedTokenUrl = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${shortLivedToken}`;
        const longLivedTokenResponse = await axios.get(longLivedTokenUrl);
        const accessToken = longLivedTokenResponse.data.access_token;

        // STEP 3: Get the user's Facebook Pages
        const pagesUrl = `https://graph.facebook.com/me/accounts?access_token=${accessToken}`;
        const pagesResponse = await axios.get(pagesUrl);
        const pages = pagesResponse.data.data;

        if (!pages || pages.length === 0) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=no_facebook_page_found`);
        }
        
        // For simplicity, we'll use the first page. In a real app, you'd let the user choose.
        const pageId = pages[0].id;

        // STEP 4: Get the Instagram Business Account ID connected to that Facebook Page
        const igAccountUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
        const igAccountResponse = await axios.get(igAccountUrl);
        const instagramBusinessAccountId = igAccountResponse.data.instagram_business_account.id;

        if (!instagramBusinessAccountId) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=no_instagram_account_linked`);
        }

        // STEP 5: Save all the details to the user's record
        const user = await User.findById(userId);
        user.connections.instagram = {
            accessToken,
            userId: (await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}`)).data.id,
            pageId,
            instagramBusinessAccountId,
        };
        await user.save();

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?success=instagram_connected`);

    } catch (error) {
        console.error('Error during Instagram OAuth callback:', error.response?.data || error.message);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=instagram_oauth_failed`);
    }
});

export default router;
