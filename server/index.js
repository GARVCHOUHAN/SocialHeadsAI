import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import cron from "node-cron";
import authRoutes from "./routes/authRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import nodeCron from "node-cron";
import oauthRoutes from "./routes/OAuthRoutes.js";
import youtubeAuthRoutes from './routes/youtubeAuthRoutes.js';
import { dashRouter } from './routes/dashboardRoutes.js';
import instagramAuthRoutes from './routes/instagramAuthRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import path from "path"; 

const app = express();

app.use(cors({origin: process.env.FRONTEND_URL}));
app.use(express.json());

mongoose.connect(`${process.env.MONGO_URI}/SocialHead-AI`)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use("/api/users", authRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/dashboard", dashRouter);
app.use("/api/oauth", youtubeAuthRoutes);
app.use("/api/oauth", oauthRoutes);
app.use('/api/oauth', instagramAuthRoutes);
app.use('/api/analysis', analysisRoutes);

app.post('/api/gemini', async (req, res) => {
    // Destructure all expected fields from the request body
    const { idea, platform, mode, isRegenerate } = req.body;
    
    const basePrompt = `You are an AI content strategist for a SaaS platform. Help creators grow on ${platform}. Respond in Markdown.`;
    
    // NEW: Add a special instruction if the user wants a new version
    const regenerateInstruction = isRegenerate 
        ? "IMPORTANT: The user has requested a new version. Provide a completely different creative direction, angle, or style from any previous suggestion. Do not repeat ideas." 
        : "";

    let prompt = "";

    switch (mode) {
        case 'expandIdea':
            prompt = `${basePrompt} ${regenerateInstruction} Expand this idea: "${idea}". Include viral angle, hook, main content, CTA.`;
            break;
        case 'refineScript':
            prompt = `${basePrompt} ${regenerateInstruction} Refine this script: "${idea}". Include hook, problem, value, CTA.`;
            break;
        case 'generateStoryboard':
            prompt = `
            Act as an expert Viral Video Producer and Content Strategist. Your client is a creator working on a video for **${platform}**.
            ${regenerateInstruction}
            **Their core idea is:** "${idea}"

            Your mission is to transform this idea into a dynamic, scroll-stopping video storyboard. The output must be clear, actionable, and optimized for maximum viewer retention and engagement on the specified platform.

            **Use the following professional storyboard format. Adhere to this structure precisely.**

            ---
            ### 🎬 Storyboard: [Come up with a catchy, working title for this video]
            **Platform:** ${platform}
            **Est. Length:** [Suggest an optimal video length, e.g., 25-30 seconds]
            ---
            **🔥 HOOK (0-3 seconds)**
            * **Scene 1:**
                * **🎥 VISUAL:** [Describe the most visually arresting opening shot.]
                * **🔊 AUDIO:** [The first line of dialogue or a trending sound/music hook.]
                * **💡 PRODUCER NOTE:** [Explain *why* this hook works.]
            ---
            **📖 BODY (3-20 seconds)**
            * **Scene 2:**
                * **🎥 VISUAL:** [Describe the shot. Suggest B-roll.]
                * **🎨 GRAPHIC:** [Suggest an on-screen graphic.]
                * **🔊 AUDIO:** [Dialogue for this scene. Mention any key sound effects (SFX).]
            ---
            **🚀 CALL TO ACTION (20-25 seconds)**
            * **Scene 5:**
                * **🎥 VISUAL:** [Creator looks directly at the camera. A 'Follow' button graphic animates on screen.]
                * **🔊 AUDIO:** [A clear call to action.]
                * **💡 PRODUCER NOTE:** [Explain the CTA strategy.]
            ---
            ### ✨ Strategic Pro-Tips:
            * **Editing Pace:** Suggest a fast pace with cuts every 1-2 seconds.
            * **Hashtag Strategy:** Provide 3-5 highly relevant, trending hashtags.
            * **Caption Hook:** Write a compelling first line for the video's caption.
            `;
           break;
        // Add other cases here, injecting `regenerateInstruction` into each prompt
        case 'suggestHashtags':
            prompt = `${basePrompt} ${regenerateInstruction} Suggest hashtags for: "${idea}". Include broad, specific, and trending ones.`;
            break;
        case 'viralNicheIdeas':
            prompt = `${basePrompt} ${regenerateInstruction} Generate 10 viral ideas for: "${idea}".`;
            break;
        case 'optimizeTitle':
            prompt = `${basePrompt} ${regenerateInstruction} Optimize YouTube titles for: "${idea}". Give 4-5 different options.`;
            break;
        case 'analyzeHook':
            prompt = `${basePrompt} ${regenerateInstruction} Analyze and improve this hook: "${idea}". Provide 3 completely different, better options.`;
            break;
        case 'analyzePerformance':
            prompt = `${basePrompt} ${regenerateInstruction} Simulate performance for: "${idea}". Suggest different A/B tests than before.`;
            break;
        default:
            return res.status(400).json({ error: 'Invalid mode' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    try {
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        res.json({ result: text || 'No response from Gemini.' });
    } catch (err) {
        console.error('Gemini API error:', err);
        res.status(500).json({ error: 'Error calling Gemini API' });
    }
});

cron.schedule("0 10 * * *", () => {
  console.log("Running daily social post scheduler...");
});


import Task from "./models/Tasks.js";
import { google } from "googleapis";
import fs from "fs";

// ...existing code...

cron.schedule("*/5 * * * *", async () => {
  const now = new Date();
  const tasks = await Task.find({ scheduledDate: { $lte: now }, uploaded: false, videoFile: { $ne: null } });
  for (const task of tasks) {
    try {
      // TODO: Get user's OAuth tokens for YouTube upload
      // Example: const oauth2Client = getUserOAuthClient(task.userId);

      // For demo, create a YouTube API client (replace with actual user tokens)
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
      oauth2Client.setCredentials({
        access_token: "USER_ACCESS_TOKEN",
        refresh_token: "USER_REFRESH_TOKEN"
      });

      const youtube = google.youtube({ version: "v3", auth: oauth2Client });
      const videoPath = path.resolve(task.videoFile);

      const res = await youtube.videos.insert({
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: task.title,
            description: task.idea,
            tags: [""],
            categoryId: "22"
          },
          status: {
            privacyStatus: "private"
          }
        },
        media: {
          body: fs.createReadStream(videoPath)
        }
      });

      // Mark as uploaded
      task.uploaded = true;
      await task.save();
      console.log(`Uploaded video for task: ${task.title}`);
    } catch (err) {
      console.error("YouTube upload failed for task:", task.title, err.message);
    }
  }
});