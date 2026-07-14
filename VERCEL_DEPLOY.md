# ⚡ Deploying on Vercel (100% Free Setup with Cron-job.org)

You can deploy both your frontend and backend on Vercel for free! However, Vercel Hobby (Free) accounts restrict built-in cron jobs to **only once per day**. 

To work around this, we use **Cron-job.org** (a free external service) to trigger our backend scheduler URL. This gives you a 100% free setup with cron execution running as often as every minute!

---

## 🚀 How to Deploy the Backend (Express Server) on Vercel

1. Go to [Vercel.com](https://vercel.com/) and log in with your **GitHub** account.
2. Click **Add New > Project** and import your **Social-Media-Scheduler** repository.
3. Configure the settings:
   * **Project Name**: `socialai-backend` (or any clean name)
   * **Framework Preset**: Select **Other** or leave default.
   * **Root Directory**: Click Edit and select the **`server`** folder.
4. Click **Environment Variables** and add all your local variables:
   * `MONGODB_URI`
   * `JWT_SECRET`
   * `ZERNIO_API_KEY`
   * `GEMINI_API_KEY`
   * `CLOUDINARY_CLOUD_NAME`
   * `CLOUDINARY_API_KEY`
   * `CLOUDINARY_API_SECRET`
   * **`CRON_SECRET`** = (Enter a secure password/token of your choice, e.g. `mySuperSecretToken123`)
5. Click **Deploy**.
6. Copy the generated backend live URL (e.g. `https://socialai-backend.vercel.app`).

---

## ⏰ How to Set Up the Free Scheduler (Cron-job.org)

To automatically publish posts at their scheduled times, configure an external cron job for free:

1. Sign up for a free account at [Cron-job.org](https://cron-job.org/).
2. In the dashboard, click **Create Cronjob**.
3. Configure your cronjob:
   * **Title**: `SocialAI Post Scheduler`
   * **Address**: `https://<your-backend-vercel-url>/api/cron/publish` (e.g. `https://socialai-backend.vercel.app/api/cron/publish`)
   * **Execution Schedule**: Select **Every 1 minute** (or **Every 5 minutes**).
   * **Request Headers**: Under headers, add:
     * **Key**: `Authorization`
     * **Value**: `Bearer <your-CRON_SECRET>` (e.g. `Bearer mySuperSecretToken123` - must match the `CRON_SECRET` variable you saved in Vercel).
4. Click **Create**.

*That's it! Cron-job.org will now trigger your Vercel serverless function every minute, publishing all scheduled posts automatically.*

---

## 🎨 How to Deploy the Frontend (React Client) on Vercel

1. In Vercel, go back to your main dashboard and click **Add New > Project**.
2. Import your **Social-Media-Scheduler** repository again.
3. Configure the settings:
   * **Project Name**: `socialai`
   * **Framework Preset**: **Vite** (auto-detected)
   * **Root Directory**: Click Edit and select the **`client`** folder.
4. Click **Environment Variables** and add:
   * **Key**: `VITE_API_BASE_URL`
   * **Value**: *Your Vercel Backend URL* (e.g. `https://socialai-backend.vercel.app`)
5. Click **Deploy**.
