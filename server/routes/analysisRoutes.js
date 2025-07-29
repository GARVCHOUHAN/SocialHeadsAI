import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { getAuthenticatedClient } from './dashboardRoutes.js'; // We'll reuse the helper
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

// Helper to convert image URL to a format Gemini can use
const urlToGenerativePart = async (url, mimeType) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
        inlineData: {
            data: Buffer.from(response.data).toString('base64'),
            mimeType,
        },
    };
};

router.post('/generate-youtube-insights', protect, async (req, res) => {
    try {
        const oAuth2Client = await getAuthenticatedClient(req.user.id);
        const accessToken = oAuth2Client.credentials.access_token;
        const analyticsApiUrl = 'https://youtubeanalytics.googleapis.com/v2/reports';
        const dataApiUrl = 'https://www.googleapis.com/youtube/v3/videos';

        // --- STAGE 1: Data Pipeline ---
        const analyticsResponse = await axios.get(analyticsApiUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { /* ...your existing params... */
                ids: 'channel==MINE',
                startDate: '2005-01-01',
                endDate: new Date().toISOString().split('T')[0],
                metrics: 'views,likes,comments',
                dimensions: 'video',
                maxResults: 20,
                sort: '-views',
            },
        });
        const videoPerformance = analyticsResponse.data.rows || [];

        if (videoPerformance.length === 0) {
            return res.status(400).json({ message: "No video performance data found. Have you uploaded any videos?" });
        }

        const videoIds = videoPerformance.map(row => row[0]).join(',');
        const titlesResponse = await axios.get(dataApiUrl, {
             headers: { Authorization: `Bearer ${accessToken}` },
             params: { part: 'snippet', id: videoIds }
        });
        const videoDetails = titlesResponse.data.items;

        // --- STAGE 2: Analysis Engine ---
        let questionMarkCount = 0;
        let listNumberCount = 0;
        const topVideos = [];

        videoPerformance.forEach(perf => {
            const detail = videoDetails.find(d => d.id === perf[0]);
            if (!detail) return;
            
            const title = detail.snippet.title;
            if (title.includes('?')) questionMarkCount++;
            if (/^\d+\s/.test(title)) listNumberCount++;

            topVideos.push({ title, views: perf[1] });
        });
        
        // --- STAGE 3: Synthesize and Store Insights ---
        const user = await User.findById(req.user.id);
        const newInsights = {
            titlePatterns: [],
            thumbnailPatterns: [], // This will be populated below
            lastUpdatedAt: new Date(),
        };

        // Title Pattern Analysis (existing logic)
        if (questionMarkCount / topVideos.length >= 0.3) {
             newInsights.titlePatterns.push({
                patternType: 'question',
                effectiveness: 0.15,
                example: topVideos.find(v => v.title.includes('?'))?.title,
            });
        }
        if (listNumberCount / topVideos.length >= 0.3) {
             newInsights.titlePatterns.push({
                patternType: 'list_number',
                effectiveness: 0.20,
                example: topVideos.find(v => /^\d+\s/.test(v.title))?.title,
            });
        }
        
        // --- NEW: Thumbnail Analysis Implementation ---
        const thumbnailAnalysisPrompt = `Analyze this YouTube thumbnail. Identify key visual patterns that contribute to a high click-through rate. Respond with a short, comma-separated list of keywords describing the most effective patterns. Only include 2-3 of the most dominant patterns. Example keywords: 'prominent_face', 'emotional_expression', 'bold_text', 'contrasting_colors', 'arrows_or_circles', 'before_and_after', 'clean_composition', 'brand_logo'`;
        
        const analysisPromises = videoDetails.map(async (video) => {
            const thumbnailUrl = video.snippet.thumbnails.high.url;
            try {
                const imagePart = await urlToGenerativePart(thumbnailUrl, 'image/jpeg');
                const result = await visionModel.generateContent([thumbnailAnalysisPrompt, imagePart]);
                const textResult = result.response.text();
                // Return the patterns and an example URL
                return { patterns: textResult.split(',').map(p => p.trim()), exampleUrl: thumbnailUrl };
            } catch (visionError) {
                console.warn(`Could not analyze thumbnail for video ${video.id}: ${visionError.message}`);
                return null; // Ignore failures for single images
            }
        });

        const analysisResults = (await Promise.all(analysisPromises)).filter(Boolean);
        
        // Aggregate patterns from all thumbnails
        const patternFrequencies = {};
        analysisResults.forEach(result => {
            result.patterns.forEach(pattern => {
                if(pattern) patternFrequencies[pattern] = (patternFrequencies[pattern] || 0) + 1;
            });
        });

        // Find common patterns (e.g., appearing in >25% of top videos)
        const commonPatternThreshold = Math.max(2, videoDetails.length * 0.25);
        for (const [pattern, count] of Object.entries(patternFrequencies)) {
            if (count >= commonPatternThreshold) {
                newInsights.thumbnailPatterns.push({
                    patternType: pattern,
                    effectiveness: 0.18, // Placeholder
                    // Find the first video that had this pattern to use as an example
                    example: analysisResults.find(r => r.patterns.includes(pattern))?.exampleUrl
                });
            }
        }
        // --- End of New Thumbnail Analysis ---

        user.insights = newInsights;
        await user.save();
        
        res.json({ status: 'success', insights: newInsights });

    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error('Error generating insights:', errorMessage);
        res.status(500).json({ message: `Failed to generate insights: ${errorMessage}` });
    }
});


// // This endpoint triggers the analysis of a user's channel
// router.post('/generate-youtube-insights', protect, async (req, res) => {
//     try {
//         const oAuth2Client = await getAuthenticatedClient(req.user.id);
//         const accessToken = oAuth2Client.credentials.access_token;
//         const analyticsApiUrl = 'https://youtubeanalytics.googleapis.com/v2/reports';
//         const dataApiUrl = 'https://www.googleapis.com/youtube/v3/videos';

//         // --- STAGE 1: Data Pipeline ---
//         // Get performance data for the user's top 20 videos
//         const analyticsResponse = await axios.get(analyticsApiUrl, {
//             headers: { Authorization: `Bearer ${accessToken}` },
//             params: {
//                 ids: 'channel==MINE',
//                 startDate: '2005-01-01', // Get all-time data
//                 endDate: new Date().toISOString().split('T')[0],
//                 metrics: 'views,likes,comments',
//                 dimensions: 'video',
//                 maxResults: 20,
//                 sort: '-views',
//             },
//         });
//         const videoPerformance = analyticsResponse.data.rows || [];

//         // Get video titles for the returned video IDs
//         const videoIds = videoPerformance.map(row => row[0]).join(',');
//         const titlesResponse = await axios.get(dataApiUrl, {
//              headers: { Authorization: `Bearer ${accessToken}` },
//              params: { part: 'snippet', id: videoIds }
//         });
//         const videoDetails = titlesResponse.data.items;

//         // --- STAGE 2: Analysis Engine ---
//         let questionMarkCount = 0;
//         let listNumberCount = 0;
//         const topVideos = [];

//         videoPerformance.forEach(perf => {
//             const detail = videoDetails.find(d => d.id === perf[0]);
//             if (!detail) return;
            
//             const title = detail.snippet.title;
//             if (title.includes('?')) questionMarkCount++;
//             if (/^\d+\s/.test(title)) listNumberCount++; // Title starts with a number, e.g., "5 Ways..."

//             topVideos.push({ title, views: perf[1] });
//         });

//         // --- STAGE 3: Synthesize and Store Insights ---
//         const user = await User.findById(req.user.id);
//         const newInsights = {
//             titlePatterns: [],
//             thumbnailPatterns: [], // Placeholder for Vision API results
//             lastUpdatedAt: new Date(),
//         };

//         if (questionMarkCount / topVideos.length >= 0.3) { // If at least 30% of top videos use questions
//              newInsights.titlePatterns.push({
//                 patternType: 'question',
//                 effectiveness: 0.15, // Placeholder effectiveness
//                 example: topVideos.find(v => v.title.includes('?'))?.title,
//             });
//         }
//         if (listNumberCount / topVideos.length >= 0.3) {
//              newInsights.titlePatterns.push({
//                 patternType: 'list_number',
//                 effectiveness: 0.20,
//                 example: topVideos.find(v => /^\d+\s/.test(v.title))?.title,
//             });
//         }
        
//         // **TODO**: Implement Thumbnail Analysis here using a Vision API.
//         // For each video in `videoDetails`, get `snippet.thumbnails.high.url`
//         // and send it to Gemini Vision for analysis. Aggregate the results.

//         user.insights = newInsights;
//         await user.save();
        
//         res.json({ status: 'success', insights: newInsights });

//     } catch (error) {
//         const errorMessage = error.response?.data?.error?.message || error.message;
//         console.error('Error generating insights:', errorMessage);
//         res.status(500).json({ message: `Failed to generate insights: ${errorMessage}` });
//     }
// });

export default router;
