# 🚀 Deploying on Render (100% Free & Easy)

**Render.com** is the recommended free hosting platform for your full-stack application. It connects directly to your GitHub repository and automatically deploys your code on every push.

Follow these step-by-step instructions to get your app live for free:

---

## 💾 Prerequisites
Make sure you have your repository pushed to GitHub: [vimalg2005/Social-Media-Scheduler](https://github.com/vimalg2005/Social-Media-Scheduler).

---

## 1. Deploy the Backend (Node.js Web Service)
1. Go to [Render.com](https://render.com/) and sign up / log in using your **GitHub account**.
2. Click the **New +** button in the dashboard and select **Web Service**.
3. Choose your **Social-Media-Scheduler** repository from the list.
4. Configure the service settings:
   *   **Name**: `socialai-backend` (or any name you prefer)
   *   **Region**: Select the one closest to you (e.g., Singapore or Oregon).
   *   **Branch**: `main`
   *   **Root Directory**: `server`
   *   **Runtime**: `Node`
   *   **Build Command**: `npm install && npm run build`
   *   **Start Command**: `node dist/server.js`
   *   **Instance Type**: Select **Free** ($0/month).
5. Scroll down, click **Advanced**, and add your Environment Variables matching your `server/.env`:
   *   `MONGODB_URI` = *Your MongoDB atlas connection string*
   *   `JWT_SECRET` = *Any custom text*
   *   `GEMINI_API_KEY` = *Your Google Gemini API Key*
   *   `ZERNIO_API_KEY` = *Your Zernio API Key*
   *   `CLOUDINARY_CLOUD_NAME` = *Your Cloudinary Cloud Name*
   *   `CLOUDINARY_API_KEY` = *Your Cloudinary API Key*
   *   `CLOUDINARY_API_SECRET` = *Your Cloudinary API Secret*
6. Click **Create Web Service**.
7. Once deployed, copy your backend's live URL (e.g. `https://socialai-backend.onrender.com`).

---

## 2. Deploy the Frontend (React Static Site)
1. In Render, click the **New +** button and select **Static Site**.
2. Choose your **Social-Media-Scheduler** repository.
3. Configure the static site settings:
   *   **Name**: `socialai` (or any name you prefer)
   *   **Branch**: `main`
   *   **Root Directory**: `client`
   *   **Build Command**: `npm install && npm run build`
   *   **Publish Directory**: `dist`
4. Click **Advanced** and add the following Environment Variable:
   *   `VITE_API_BASE_URL` = *Your backend live URL that you copied in Step 1* (e.g. `https://socialai-backend.onrender.com`)
5. Click **Create Static Site**.
6. **Important for React Router routing**:
   *   Once the static site is created, go to the site's dashboard, click **Redirects/Rewrites** in the sidebar.
   *   Click **Add Rule**.
   *   **Source**: `/*`
   *   **Destination**: `/index.html`
   *   **Action**: `Rewrite`
   *   Save changes (this ensures page reloads do not return a 404 error).

---

## 🎉 You're Done!
Your site is now live! Render will build your static frontend and link it to your backend. Whenever you push new commits to your GitHub `main` branch, Render will automatically rebuild and update your site.
