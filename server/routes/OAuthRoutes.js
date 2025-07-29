import express from "express";
import axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// --- Instagram OAuth ---
router.get("/instagram", (req, res) => {
  const redirect = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/api/oauth/instagram/callback&scope=instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement&response_type=code`;
  res.redirect(redirect);
});

router.get("/instagram/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { data } = await axios.post(
      `https://graph.facebook.com/v19.0/oauth/access_token`,
      querystring.stringify({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/oauth/instagram/callback`,
        code,
      })
    );
    // Save access_token in DB
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({ error: "Instagram OAuth failed" });
  }
});

// --- Twitter OAuth 2.0 ---
router.get("/twitter", (req, res) => {
  const redirect = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/api/oauth/twitter/callback&scope=tweet.read users.read offline.access&state=&code_challenge=challenge&code_challenge_method=plain`;
  res.redirect(redirect);
});

router.get("/twitter/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { data } = await axios.post(
      `https://api.twitter.com/2/oauth2/token`,
      querystring.stringify({
        code,
        grant_type: "authorization_code",
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL}/api/oauth/twitter/callback`,
        code_verifier: "challenge",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({ error: "Twitter OAuth failed" });
  }
});

// --- TikTok OAuth ---
router.get("/tiktok", (req, res) => {
  const redirect = `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&redirect_uri=${process.env.BASE_URL}/api/oauth/tiktok/callback&response_type=code&scope=user.info.basic,video.list&state=SocialHead-AI`;
  res.redirect(redirect);
});

router.get("/tiktok/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { data } = await axios.post(
      `https://open.tiktokapis.com/v2/oauth/token/`,
      {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.BASE_URL}/api/oauth/tiktok/callback`,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({ error: "TikTok OAuth failed" });
  }
});

export default router;