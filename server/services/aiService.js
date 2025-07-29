// server/services/aiService.js
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Wrapper to generate a script using Gemini with fallback to Claude
 */
export async function generateScript(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.warn("Gemini failed, falling back to Claude:", err.message);
    const completion = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    return completion.content[0].text;
  }
}

/**
 * Generate trend-based content ideas using Claude with Gemini fallback
 */
export async function generateIdeas(trendDescription) {
  const message = `Act like a viral content strategist. Based on the trend: "${trendDescription}", suggest 3 unique content scripting ideas for Reels or Shorts.`;

  try {
    const completion = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
    });
    return completion.content[0].text;
  } catch (err) {
    console.warn("Claude failed, falling back to Gemini:", err.message);
    return await generateScript(message);
  }
}

/**
 * Refine existing script with Gemini; fallback to Claude
 */
export async function refineScript(script, platform) {
  const prompt = `Refine this content script for the ${platform} platform to make it more engaging and on-trend:\n\n${script}`;
  try {
    return await generateScript(prompt);
  } catch (err) {
    console.warn("Refinement via Gemini failed, using Claude:", err.message);
    const completion = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    return completion.content[0].text;
  }
}
