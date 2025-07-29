# SocialHeads-AI

SocialHeads-AI is a full-stack platform for content creators to plan, analyze, and grow their social media presence. It provides tools for content planning, AI-powered script assistance, analytics, earnings tracking, logistics, and notifications.

## Project Structure

```
client/      # Frontend (React + Vite)
server/      # Backend (Node.js + Express + MongoDB)
```

## Features

- **Content Planner:** Schedule, track, and manage your video ideas and uploads.
- **AI Script Assistant:** Generate and refine scripts using Gemini and Claude AI.
- **Analytics:** Personalized insights for YouTube channel performance.
- **Earnings:** Track sponsorships, Adsense, memberships, and transactions.
- **Logistics:** Manage merchandise orders and shipping.
- **Notifications:** Stay updated on comments, followers, logistics, and earnings.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Atlas or local)
- Yarn or npm

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/socialheads-ai.git
cd socialheads-ai
```

#### 2. Install dependencies

```sh
cd client
npm install
cd ../server
npm install
```

#### 3. Configure environment variables

Create `.env` files in both `client/` and `server/` directories. See `.env.example` for required variables.

#### 4. Run the development servers

**Backend:**
```sh
cd server
npm run dev
```

**Frontend:**
```sh
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Technologies Used

- React, Vite, Tailwind CSS
- Node.js, Express, Mongoose
- Google Gemini, Anthropic Claude AI
- Recharts (for analytics)
- Multer (file uploads)

## License

MIT

---

For more details, see the code in [client/](client) and [server/](server)
