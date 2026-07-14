# Deploying Social-Media-Scheduler on AWS EC2 (Free & Script-Automated)

To satisfy the request for a deployment option that is **both free and easy to use**, we recommend using **AWS EC2 (Free Tier)** combined with an **Automated Deployment Script** that we will write. 

This gives you a $0 cost hosting solution (under the 12-month AWS Free Tier) while removing the manual server configuration complexity.

---

## The Recommended Approach: Automated EC2 Deployment

We will write a deployment shell script (`deploy-ec2.sh`) that you can run on a fresh Ubuntu EC2 instance. This script will automate the entire server setup:
1.  Install system dependencies (Node.js v20, npm, Git, Nginx, PM2).
2.  Install packages and build both the frontend and backend.
3.  Configure Nginx as a reverse proxy:
    *   Serve React frontend static files directly for fast loading.
    *   Proxy all `/api/*` traffic to the Node.js Express server running on port 3000.
4.  Start the Express server in the background using PM2 (ensures it automatically restarts on crash or reboot).

---

## Steps to Deploy

### Step 1: Launch an AWS EC2 Instance (User Action)
1.  Log in to your **AWS Console**.
2.  Navigate to **EC2** and click **Launch Instance**.
3.  Choose **Ubuntu 24.04 LTS** as the Operating System (Amazon Machine Image).
4.  Select **t2.micro** (or **t3.micro** depending on region) which is **Free Tier Eligible**.
5.  Under **Key pair**, select or create a key pair to SSH into the instance.
6.  Under **Network settings / Security Group**, check:
    *   `Allow SSH traffic from` (Anywhere or your IP)
    *   `Allow HTTP traffic from the internet` (Port 80)
    *   `Allow HTTPS traffic from the internet` (Port 443)
7.  Click **Launch Instance**.

### Step 2: Run the Deployment Script (User Action)
Once the instance is running, SSH into it and run:
```bash
# Clone the repository
git clone <your-repo-url> social-scheduler
cd social-scheduler

# Run our automation script (which we will create next)
chmod +x scripts/deploy-ec2.sh
./scripts/deploy-ec2.sh
```

---

## Proposed Changes

We will create the following files in the project workspace:

### Scripts

#### [NEW] [deploy-ec2.sh](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/scripts/deploy-ec2.sh)
A bash script to automate:
*   Node.js v20 & Nginx installation.
*   Nginx configuration for serving the build folder of the React client and routing `/api` to the backend.
*   Installing PM2 and configuring it to start/restart the backend `dist/server.js`.
*   Setting up environment variables from a prompt.

#### [NEW] [nginx.conf.template](file:///c:/Users/vimal/OneDrive/Desktop/social-scheduler/scripts/nginx.conf.template)
Nginx server block template routing static traffic to `/client/dist` and API traffic to `http://localhost:3000`.

---

## Open Questions

> [!IMPORTANT]
> 1. **Do you have a custom domain name?** (If yes, we can include automatic SSL setup with Let's Encrypt / Certbot in the script. If no, the app will be accessed directly via the EC2 Public IP address over HTTP).
> 2. **Can you push the latest codebase to a Git repository?** This is required so you can easily run `git clone` on your EC2 instance.
