import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/youtube", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await axios.get("https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true", {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "YouTube API fetch failed" });
  }
});

router.get("/instagram", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${token}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Instagram API fetch failed" });
  }
});

export default router;