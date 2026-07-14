# ⚡ Deploying on Vercel (Important Serverless Info)

You can absolutely deploy your project on **Vercel**! However, because Vercel is a **Serverless** platform, there is an important architectural limitation regarding the backend scheduler.

---

## ⚠️ The Serverless Limitation (Why Render + Vercel is best)

Your backend has an automated post scheduler (`server/services/schedulerService.ts`) powered by `node-cron` that runs **every minute** to check for and publish scheduled posts:
```typescript
cron.schedule("* * * * *", async () => { ... })
```

*   **Vercel** runs code as **Serverless Functions** (ephemeral containers that spin up to handle a request and immediately shut down). They **cannot** keep a background loop running. If you deploy the backend to Vercel, **your scheduled posts will never publish automatically**.
*   **Render** runs as a **persistent background service**. The server stays online, meaning `node-cron` runs every minute without issues.

### 💡 The Recommended Free Setup
1.  **Backend (Render - Free)**: Host the Express server on Render (which supports background processes/cron).
2.  **Frontend (Vercel - Free)**: Host the React static site on Vercel (which is ultra-fast and has a great free tier).

---

## 🚀 How to Deploy the Frontend on Vercel

If you host your backend on Render (see [RENDER_DEPLOY.md](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/RENDER_DEPLOY.md)), follow these steps to deploy the React frontend on Vercel:

1.  Go to [Vercel.com](https://vercel.com/) and log in with your **GitHub** account.
2.  Click **Add New > Project**.
3.  Import your **Social-Media-Scheduler** repository.
4.  Configure the project settings:
    *   **Project Name**: `socialai-frontend`
    *   **Framework Preset**: Select **Vite** (Vercel should auto-detect this).
    *   **Root Directory**: Click Edit and select the **`client`** folder.
5.  Click the **Environment Variables** dropdown and add:
    *   **Key**: `VITE_API_BASE_URL`
    *   **Value**: *Your Render backend URL* (e.g., `https://socialai-backend.onrender.com`)
6.  Click **Deploy**.
7.  Once deployed, Vercel will give you a live URL (e.g. `https://socialai.vercel.app`).

---

## 🛠️ Alternative: Deploying Both on Vercel (Advanced)

If you want both frontend and backend on Vercel, you would need to:
1.  Refactor the backend to expose a public endpoint (e.g. `GET /api/posts/cron-trigger`).
2.  Use **Vercel Cron Jobs** (configured in `vercel.json`) to trigger that endpoint periodically.
3.  *Note*: Vercel's Free Tier cron jobs can only run **once every 10 minutes** at most (compared to our current 1-minute interval), and serverless execution timeouts are capped at 10 seconds.
