#!/bin/bash

# SocialAI EC2 Deployment Automation Script
# Must be run on the EC2 instance (Ubuntu LTS recommended)

set -e

# Color variables
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}      SocialAI EC2 Automated Deployment        ${NC}"
echo -e "${GREEN}===============================================${NC}"

# 1. Check if run with sudo/root privileges
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run this script with sudo or as root:${NC}"
  echo "sudo ./scripts/deploy-ec2.sh"
  exit 1
fi

# Get the directory where this script is located and resolve project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo -e "\n${YELLOW}[1/7] Updating system and installing dependencies...${NC}"
apt-get update -y
apt-get install -y curl gnupg build-essential git Nginx certbot python3-certbot-nginx

# Install Node.js v20 LTS
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}Installing Node.js v20...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo -e "${GREEN}Node.js is already installed ($(node -v))${NC}"
fi

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
  echo -e "${YELLOW}Installing PM2 process manager globally...${NC}"
  npm install -g pm2
else
  echo -e "${GREEN}PM2 is already installed ($(pm2 -v))${NC}"
fi

# 2. Prompt for Domain / IP
echo -e "\n${YELLOW}[2/7] Configuration Setup...${NC}"
read -p "Enter your EC2 Public IP or Custom Domain (e.g., 54.210.12.34 or app.domain.com): " DOMAIN_OR_IP
if [ -z "$DOMAIN_OR_IP" ]; then
  echo -e "${RED}Error: Domain or IP cannot be empty.${NC}"
  exit 1
fi

# Ask about SSL
read -p "Do you want to configure automated HTTPS/SSL using Let's Encrypt? (y/N): " SETUP_SSL

# 3. Build React Frontend
echo -e "\n${YELLOW}[3/7] Building React Frontend...${NC}"
cd "$PROJECT_ROOT/client"

# Create production .env
echo "Creating client production .env..."
if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
  echo "VITE_API_BASE_URL=\"https://${DOMAIN_OR_IP}\"" > .env
else
  echo "VITE_API_BASE_URL=\"http://${DOMAIN_OR_IP}\"" > .env
fi
echo -e "${GREEN}Saved configuration: $(cat .env)${NC}"

echo "Installing frontend dependencies..."
npm install

echo "Compiling frontend assets..."
npm run build

# 4. Build Node.js Backend
echo -e "\n${YELLOW}[4/7] Building Node.js Backend...${NC}"
cd "$PROJECT_ROOT/server"

echo "Installing backend dependencies..."
npm install

echo "Compiling TypeScript... (${PROJECT_ROOT}/server/tsconfig.json)"
npm run build

# Handle Backend .env configuration
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating backend .env from template. You MUST fill in your actual credentials.${NC}"
  cp .env.example .env
  # Note: The user will need to edit this file with their own secret keys (MongoDB, Gemini, Cloudinary, etc.)
  echo -e "${RED}WARNING: A template .env has been created in server/.env. Please configure your MongoDB, Gemini, and Cloudinary keys before starting.${NC}"
else
  echo -e "${GREEN}Backend .env already exists.${NC}"
fi

# 5. Configure Nginx
echo -e "\n${YELLOW}[5/7] Configuring Nginx web server...${NC}"
NGINX_TEMPLATE="$PROJECT_ROOT/scripts/nginx.conf.template"
NGINX_DEST="/etc/nginx/sites-available/social-scheduler"

if [ -f "$NGINX_TEMPLATE" ]; then
  echo "Applying Nginx configuration template..."
  # Copy template and replace placeholders
  cp "$NGINX_TEMPLATE" "$NGINX_DEST"
  sed -i "s/server_name _;/server_name ${DOMAIN_OR_IP};/g" "$NGINX_DEST"
  # Set correct root path dynamically in Nginx configuration
  sed -i "s|root /home/ubuntu/social-scheduler/client/dist;|root ${PROJECT_ROOT}/client/dist;|g" "$NGINX_DEST"
  
  # Enable the site and disable default site
  ln -sf "$NGINX_DEST" /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default
  
  echo "Testing Nginx configuration..."
  nginx -t
  
  echo "Restarting Nginx..."
  systemctl restart nginx
  echo -e "${GREEN}Nginx configured and restarted successfully.${NC}"
else
  echo -e "${RED}Error: Nginx template not found at $NGINX_TEMPLATE${NC}"
  exit 1
fi

# 6. Start Backend with PM2
echo -e "\n${YELLOW}[6/7] Starting Backend Process...${NC}"
cd "$PROJECT_ROOT/server"

# Stop existing app instance if running
pm2 stop social-scheduler-backend || true
pm2 delete social-scheduler-backend || true

# Start backend using PM2
echo "Starting backend server..."
pm2 start dist/server.js --name "social-scheduler-backend"

# Setup PM2 to run on startup
pm2 save
pm2 startup systemd || true
echo -e "${GREEN}Backend is now managed by PM2.${NC}"

# 7. Configure SSL (Optional)
if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
  echo -e "\n${YELLOW}[7/7] Setting up SSL via Let's Encrypt / Certbot...${NC}"
  echo "Note: This requires your custom domain to point to this server's public IP address."
  certbot --nginx -d "$DOMAIN_OR_IP" --non-interactive --agree-tos --redirect -m admin@"$DOMAIN_OR_IP"
  echo -e "${GREEN}SSL configured successfully!${NC}"
else
  echo -e "\n${YELLOW}[7/7] Skipping SSL setup. App will run over HTTP on port 80.${NC}"
fi

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}       Deployment Completed Successfully!      ${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e "\nTo access your site, open your browser and navigate to: http://${DOMAIN_OR_IP}"
echo -e "\n${YELLOW}IMPORTANT CHECKLIST:${NC}"
echo -e "1. Edit the backend config at: ${PROJECT_ROOT}/server/.env"
echo -e "   Fill in MONGODB_URI, JWT_SECRET, ZERNIO_API_KEY, and GEMINI_API_KEY."
echo -e "2. Restart the backend process after updating .env:"
echo -e "   pm2 restart social-scheduler-backend"
echo -e "3. To view logs run: pm2 logs"
