# SocialAI — Social Media Automation & AI Scheduler Dashboard

**SocialAI** is a premium, full-stack social media scheduling and automation dashboard built for developers, agencies, and content creators. It features a fully responsive cosmic dark-themed glassmorphism layout, an interactive AI content composer powered by Google Gemini, automated scheduling, and direct multi-channel publishing.

---

## 🚀 Key Features

*   **Cosmic Glassmorphic UI**: High-fidelity dark theme with vibrant ambient color glows, smooth page transitions, custom sliders, and micro-animations.
*   **AI Content Composer**: Enter a prompt and synthesize complete social media post copy, select post tone (e.g. *Creative, Professional, Funny*), and generate high-resolution image assets with **Pollinations.ai**.
*   **Dynamic Loader States**: Visualized step-by-step progress tracking (*Ideating concept... $\rightarrow$ Drafting copy... $\rightarrow$ Generating artwork...*) during content creation.
*   **Interactive Post Queues**: Clean, space-efficient tabbed queue selector to review **Upcoming**, **Published**, and **Failed** scheduled posts.
*   **Social Accounts Manager**: Connect multiple real social channels (Facebook Pages, LinkedIn Pages, Instagram Business, and X/Twitter profiles) with dedicated custom badges.
*   **Premium Billing Simulation**: Real-time checkout simulation offering pricing tiers, card detail validation, and plan upgrade/downgrade toggle flows.
*   **Fail-Safe Logging**: Background cron publisher that monitors publishing state, retries failures, and records failed posts inside the dashboard activity timeline logs.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js (v19), Vite (v8), TailwindCSS, Lucide Icons, React Hot Toast, Axios.
*   **Backend**: Node.js, Express.js (v5), Nodemon, Node-Cron, TSX.
*   **Database**: MongoDB Atlas, Mongoose.
*   **AI Integration**: Google Gemini API, Pollinations.ai.
*   **Social Media API Engine**: Zernio.

---

## 📦 Local Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### 2. Clone and Configure
1. Clone this repository to your local folder.
2. In the `server` directory, create a `.env` file based on `.env.example`:
   ```bash
   cp server/.env.example server/.env
   ```
   Fill in your API credentials (MongoDB Connection URI, JWT Secret, Zernio API Key, Gemini API Key, and Cloudinary keys).
3. In the `client` directory, create a `.env` file based on `.env.example`:
   ```bash
   cp client/.env.example client/.env
   ```

### 3. Install Dependencies & Launch
1. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm run server
   ```
   *The server will start on [http://localhost:3000](http://localhost:3000)*.

2. **Start Frontend Web App**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   *The client dev server will launch on [http://localhost:5175/](http://localhost:5175/)*.

---

## 🔒 Security Information
**IMPORTANT**: Never commit `.env` configuration files to public repositories. All sensitive files (`.env`, `node_modules`, build artifacts) are ignored via `.gitignore` to prevent secret leaks and keep credentials secure.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to open a pull request or submit issues on the project repository.
