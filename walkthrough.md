# Walkthrough & Deployment Guide

This document summarizes the changes made to the **SocialAI** project, including:
1.  **Home Page UI Redesign** (converting it to the premium Cosmic Dark theme).
3.  **Free-Tier Cloud Deployment Guides** (Render for backend, Vercel for frontend).

---

## 🎨 Home Page UI Redesign (Cosmic Dark Glassmorphism)

The landing page (`/`) has been redesigned to match the high-fidelity cosmic dark dashboard aesthetics:

*   **Global Theme Alignment**: Updated [Home.tsx](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/client/src/pages/Home.tsx) to use `#07090e` base dark background and `#f1f5f9` text color.
*   **Glassmorphic Components**: Converted components under `client/src/components/Home` (`Features`, `HowItWorks`, `Testimonials`, `Pricing`, `CTA`, `Footer`) to use translucent panels (`glass-panel`) and interactive hover transitions (`glass-panel-hover`).
*   **Accent Glows & Gradients**: Added red/purple ambient radial glows, glowing text gradients, and glowing active borders.
*   **Mock Dashboard Update**: Refactored the dashboard illustration inside [Hero.tsx](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/client/src/components/Home/Hero.tsx) to display a matching dark-themed dashboard mockup instead of a light grey one.

---

## 🌐 AWS EC2 Production Deployment

We have created an automated setup to easily host your app on AWS EC2 (Free-Tier eligible).

### Added Files:
1.  **[nginx.conf.template](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/scripts/nginx.conf.template)**: Routing template to serve static assets and proxy `/api/*` to Node.js backend.
2.  **[deploy-ec2.sh](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/scripts/deploy-ec2.sh)**: Automated shell script to install dependencies, build frontend/backend, configure Nginx, and run backend via PM2.

### Step-by-Step Deployment Instructions:

1.  **Launch a Free-Tier EC2 Instance**:
    *   OS: **Ubuntu 24.04 LTS**.
    *   Instance Type: **t2.micro** or **t3.micro** (Free Tier eligible).
    *   Security Group: Allow **SSH (Port 22)**, **HTTP (Port 80)**, and **HTTPS (Port 443)**.
2.  **SSH into the Instance & Clone Repo**:
    ```bash
    git clone <your-github-repo-url> social-scheduler
    cd social-scheduler
    ```
3.  **Run Automation Script**:
    ```bash
    chmod +x scripts/deploy-ec2.sh
    sudo ./scripts/deploy-ec2.sh
    ```
    *Provide your public IP/domain when prompted.*
4.  **Edit Production Keys & Start**:
    ```bash
    nano server/.env
    # Fill in MONGODB_URI, GEMINI_API_KEY, CLOUDINARY, and ZERNIO credentials
    
    pm2 restart social-scheduler-backend
    ```

---

## 🌐 Free-Tier Cloud Deployment (Render & Vercel)

We have created dedicated step-by-step guides for free-tier deployments:

1.  **[RENDER_DEPLOY.md](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/RENDER_DEPLOY.md)**: Guides you through hosting your backend (Node.js/Express) on Render's free tier. Render is required for the backend because it supports continuous background execution (necessary for the post scheduler to run every minute).
2.  **[VERCEL_DEPLOY.md](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/VERCEL_DEPLOY.md)**: Guides you through hosting your React frontend on Vercel's high-speed CDN for free. Includes instructions on connecting Vercel to your Render backend via environment variables.
