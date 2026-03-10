# African Job Market Intelligence Platform - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Data Science Setup](#data-science-setup)
6. [Database Configuration](#database-configuration)
7. [Running the Application](#running-the-application)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **OS**: Linux, macOS, or Windows (with WSL2)
- **RAM**: 8GB minimum
- **Disk**: 10GB free space

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.9 or higher
- **MongoDB**: v5.0 or higher (or MongoDB Atlas account)
- **Git**: Latest version

### Installation

#### macOS (using Homebrew)
```bash
brew install node python mongodb-community git
```

#### Ubuntu/Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs python3 python3-pip git
sudo apt-get install -y mongodb-org
```

#### Windows
- Download Node.js from https://nodejs.org/
- Download Python from https://www.python.org/
- Download MongoDB from https://www.mongodb.com/try/download/community
- Download Git from https://git-scm.com/

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/African-market-intelligence.git
cd African-market-intelligence
```

### 2. Create Environment Files

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobmarket
DB_NAME=jobmarket

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@jobmarket.ai
ADMIN_PASSWORD=secure-password
```

#### Frontend (.env.local)
```bash
cd ../frontend
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=JobMarket.AI
EOF
```

#### Data Science (.env)
```bash
cd ../data-science
cp .env.example .env
```

Edit `data-science/.env`:
```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobmarket
DB_NAME=jobmarket

# Scraper
SCRAPER_TIMEOUT=30
SCRAPER_RETRIES=3
SCRAPER_DELAY=2

# Job Boards to Scrape
SCRAPE_LINKEDIN=true
SCRAPE_INDEED=true
SCRAPE_REMOTEOK=true
SCRAPE_ANGEL_LIST=true

# Logging
LOG_LEVEL=INFO
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Verify Installation
```bash
npm run type-check
npm run lint
```

### 3. Development Server
```bash
npm run dev
```

Access at: http://localhost:3000

### 4. Build for Production
```bash
npm run build
npm start
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

This will:
- Create MongoDB collections
- Create indexes
- Seed initial data (optional)

### 3. Verify Installation
```bash
npm run lint
npm test
```

### 4. Development Server
```bash
npm run dev
```

API runs at: http://localhost:5000

### 5. API Documentation
Once running, visit: http://localhost:5000/api-docs

## Data Science Setup

### 1. Create Virtual Environment
```bash
cd data-science
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Verify Installation
```bash
python -c "import pandas, numpy, sklearn; print('All packages installed successfully')"
```

### 4. Run Data Pipeline
```bash
python main.py
```

This will:
- Scrape job postings
- Clean and process data
- Train ML models
- Update database with insights

### 5. Schedule Automated Scraping
```bash
# Install schedule package
pip install schedule

# Run scheduler (keep running in background)
python scheduler.py
```

## Database Configuration

### Option 1: Local MongoDB

#### Start MongoDB Service
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows (in PowerShell as Admin)
net start MongoDB
```

#### Verify Connection
```bash
mongosh
# Should show: test>
exit
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Create" → "Build a Cluster"
   - Choose free tier
   - Select region closest to Africa
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Click "Add User"

4. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

5. **Update .env Files**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobmarket
   ```

## Running the Application

### Terminal 1: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
```

### Terminal 3: Data Science (Optional)
```bash
cd data-science
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs
- **MongoDB**: localhost:27017 (if local)

## Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Visit https://vercel.com
   - Click "New Project"
   - Import GitHub repository
   - Set environment variables
   - Click "Deploy"

3. **Configure Environment**
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` pointing to backend

### Backend Deployment (Railway)

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose repository
   - Select `backend` directory
   - Add environment variables
   - Deploy

3. **Configure Database**
   - Add MongoDB Atlas URI to environment variables

### Data Science Deployment (Railway Worker)

1. **Create Worker Service**
   - In Railway project, click "New Service"
   - Select "GitHub Repo"
   - Choose data-science directory
   - Set command: `python main.py`

2. **Schedule Scraping**
   - Use Railway's cron job feature
   - Or deploy separate scheduler service

## Verification Checklist

- [ ] Node.js and npm installed
- [ ] Python 3.9+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed
- [ ] Data Science dependencies installed
- [ ] Environment files created and configured
- [ ] Database initialized
- [ ] Frontend running on port 3000
- [ ] Backend running on port 5000
- [ ] Can access API documentation
- [ ] Can login/signup on frontend

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If connection fails:
# 1. Verify MongoDB service is running
# 2. Check connection string in .env
# 3. Verify firewall settings
# 4. For Atlas: Check IP whitelist
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :5000  # Backend

# Kill process
kill -9 <PID>
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Python Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### CORS Errors
- Verify `FRONTEND_URL` in backend .env
- Check CORS configuration in `backend/server.js`
- Ensure frontend and backend URLs match

### Database Initialization Fails
```bash
# Check MongoDB connection
mongosh

# Manually initialize
cd backend
node utils/databaseInit.js
```

## Next Steps

1. **Create Admin Account**
   - Visit http://localhost:3000/signup
   - Use admin email from .env
   - Set role to "admin"

2. **Start Scraping Data**
   - Run data science pipeline
   - Monitor scraper logs

3. **Explore Dashboards**
   - Login as different user types
   - Test all features

4. **Configure Email Notifications**
   - Update SMTP settings in .env
   - Test email sending

5. **Set Up Monitoring**
   - Configure error tracking
   - Set up logging

## Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Email**: support@jobmarket.ai

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Python Pandas](https://pandas.pydata.org/docs/)
- [Scikit-learn](https://scikit-learn.org/stable/)
