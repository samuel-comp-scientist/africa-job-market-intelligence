# Backend Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy the environment example file:
```bash
cp .env.example .env
```

Update your `.env` file with your MongoDB URI:
```
MONGODB_URI=mongodb+srv://efootballrwanda:abamakabe@cluster0.ovct6sh.mongodb.net/
```

### 3. Initialize Database
```bash
npm run init-db
```

This will:
- Connect to your MongoDB database
- Create all collections with proper indexes
- Insert sample data for testing

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Collections Created:

1. **jobs** - Job postings with full details
2. **companies** - Hiring company information
3. **skills** - Technical skills and analytics
4. **salaryAnalytics** - Aggregated salary data
5. **skillTrends** - Skill demand trends
6. **predictions** - AI-powered predictions
7. **scraperLogs** - Scraping activity logs

### Key Indexes:

#### Jobs Collection:
- `jobTitle` (text index)
- `country` (index)
- `skills` (index)
- `postedDate` (index)
- Compound: `{ country: 1, postedDate: -1 }`
- Compound: `{ skills: 1, postedDate: -1 }`

#### Skills Collection:
- `name` (unique index)
- `category` (index)
- `demand.current.count` (index)
- `growth.monthly` (index)

## 🔗 API Endpoints

### Jobs API
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/:id` - Get specific job
- `GET /api/jobs/stats/overview` - Job statistics
- `POST /api/jobs/search` - Advanced job search

### Skills API
- `GET /api/skills/top` - Top demanded skills
- `GET /api/skills/trends` - Skill demand trends
- `GET /api/skills/salary` - Salary by skill
- `GET /api/skills/categories` - Skills by categories

### Salaries API
- `GET /api/salaries/analytics` - Comprehensive salary analytics
- `GET /api/salaries/trends` - Salary trends over time
- `POST /api/salaries/compare` - Compare salaries
- `GET /api/salaries/benchmark` - Salary benchmarks

### Trends API
- `GET /api/trends/predictions` - AI predictions
- `GET /api/trends/emerging` - Emerging skills
- `GET /api/trends/market` - Market trends
- `GET /api/trends/regions` - Regional trends

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

## 🧪 Testing the Setup

### Test Database Connection
```bash
curl http://localhost:5000/health
```

### Test Sample Data
```bash
# Get all jobs
curl http://localhost:5000/api/jobs

# Get top skills
curl http://localhost:5000/api/skills/top

# Get salary analytics
curl http://localhost:5000/api/salaries/analytics
```

## 🔧 Configuration Options

### Environment Variables:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for CORS
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Sample `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://efootballrwanda:abamakabe@cluster0.ovct6sh.mongodb.net/
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚨 Common Issues

### MongoDB Connection Issues
1. Verify your MongoDB URI is correct
2. Check network connectivity
3. Ensure MongoDB cluster is running

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📈 Sample Data

The initialization script creates sample data including:
- 5 sample skills with demand analytics
- 3 sample companies
- 3 sample job postings
- 1 salary analytics record

This allows you to test the API immediately without waiting for scraped data.

## 🔄 Database Operations

### Reset Database
```bash
npm run init-db
```

### View Collections
```bash
# Connect to MongoDB and list collections
mongosh "mongodb+srv://efootballrwanda:abamakabe@cluster0.ovct6sh.mongodb.net/"
show collections
```

### Monitor Performance
```bash
# Check MongoDB indexes
db.jobs.getIndexes()
db.skills.getIndexes()

# View query performance
db.jobs.find({ country: "Nigeria" }).explain("executionStats")
```

## 🎯 Next Steps

1. **Test all API endpoints** using the sample data
2. **Configure the data scraper** to start collecting real job data
3. **Set up the frontend** to consume the API
4. **Configure automated scraping** with cron jobs
5. **Monitor database performance** and optimize queries

## 📞 Support

If you encounter any issues:
1. Check the server logs for error messages
2. Verify MongoDB connection and permissions
3. Ensure all environment variables are set correctly
4. Check that all dependencies are installed properly

The backend is now ready to power the African Job Market Intelligence Platform! 🚀
