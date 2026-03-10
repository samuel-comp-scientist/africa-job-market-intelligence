# African Job Market Intelligence Platform - Project Structure

## Overview
A full-stack AI-powered platform providing data-driven insights into African tech job markets, skill demands, salary trends, and future predictions.

## Directory Structure

```
African-market-intelligence/
│
├── frontend/                          # Next.js 14 + TypeScript Dashboard
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx              # Landing page (hero, features, testimonials)
│   │       ├── layout.tsx            # Root layout with metadata
│   │       ├── globals.css           # Global styles
│   │       └── pages/
│   │           ├── login.tsx         # User login page
│   │           ├── signup.tsx        # User registration page
│   │           └── dashboard/
│   │               ├── jobseeker.tsx      # Job seeker dashboard
│   │               ├── recruiter.tsx      # Recruiter dashboard
│   │               └── dataanalyst.tsx    # Researcher/analyst dashboard
│   ├── components/
│   │   ├── LoginPage.tsx             # Login component
│   │   ├── SignupPage.tsx            # Signup component
│   │   └── dashboards/
│   │       ├── JobSeekerDashboard.tsx
│   │       ├── RecruiterDashboard.tsx
│   │       └── DataAnalystDashboard.tsx
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── public/                       # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── backend/                           # Express.js + MongoDB API
│   ├── controllers/                  # Route handlers
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── skillController.js
│   │   ├── salaryController.js
│   │   ├── predictionController.js
│   │   └── userController.js
│   ├── models/                       # MongoDB Schemas
│   │   ├── User.js                   # User accounts
│   │   ├── Job.js                    # Job postings
│   │   ├── Skill.js                  # Tech skills
│   │   ├── Company.js                # Company data
│   │   ├── SalaryAnalytics.js        # Salary statistics
│   │   ├── SkillTrends.js            # Skill demand trends
│   │   ├── Prediction.js             # AI predictions
│   │   └── ScraperLog.js             # Scraper execution logs
│   ├── routes/                       # API endpoints
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── skills.js
│   │   ├── salaries.js
│   │   ├── predictions.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication
│   │   ├── validation.js             # Request validation
│   │   └── errorHandler.js           # Error handling
│   ├── utils/
│   │   ├── databaseInit.js           # MongoDB initialization
│   │   ├── emailService.js           # Email notifications
│   │   └── validators.js             # Data validators
│   ├── server.js                     # Express app setup
│   ├── package.json
│   └── .env.example
│
├── data-science/                      # Python Data Pipeline
│   ├── scraper/
│   │   └── job_scraper.py            # Web scraper for job boards
│   ├── analysis/
│   │   └── data_analyzer.py          # Data cleaning & analysis
│   ├── models/
│   │   └── skill_predictor.py        # ML model for predictions
│   ├── utils/
│   │   └── database.py               # Database utilities
│   ├── main.py                       # Pipeline orchestrator
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                              # Documentation
│   ├── API.md                        # API documentation
│   ├── SETUP.md                      # Setup instructions
│   ├── ARCHITECTURE.md               # System architecture
│   └── DATA_SCHEMA.md                # Database schema
│
├── README.md                          # Project overview
├── PROJECT_STRUCTURE.md               # This file
└── .gitignore
```

## Key Features by Component

### Frontend (Next.js)
- **Landing Page**: Hero section, features showcase, testimonials, FAQ
- **Authentication**: Login/signup with JWT
- **Job Seeker Dashboard**: 
  - Job search with filters
  - Top skills visualization
  - Salary analytics
  - Career predictions
  - Saved jobs
  - Notifications
- **Recruiter Dashboard**:
  - Talent analytics
  - Salary benchmarking
  - Hiring trends
  - Candidate insights
- **Researcher Dashboard**:
  - Aggregated analytics
  - Data export (CSV/PDF)
  - API access
  - Custom reports

### Backend (Express.js)
- **Authentication**: JWT-based user auth
- **Job Management**: CRUD operations for job postings
- **Analytics APIs**:
  - Top skills endpoint
  - Salary statistics
  - Job distribution
  - Trend analysis
- **Predictions**: AI-powered skill demand forecasts
- **User Management**: Profile, preferences, saved jobs
- **Admin Panel**: Data management, user management, system logs

### Data Science (Python)
- **Job Scraper**: Collects postings from African job boards
- **Data Cleaning**: Pandas/NumPy processing
- **Analysis**: Skill trends, salary patterns
- **ML Model**: Scikit-learn for skill demand prediction
- **Scheduler**: Cron jobs for automated scraping

## Technology Stack

### Frontend
- Next.js 14 (React framework)
- TypeScript
- TailwindCSS (styling)
- Recharts (data visualization)
- Axios (HTTP client)
- Lucide React (icons)

### Backend
- Node.js 18+
- Express.js
- MongoDB (Atlas)
- Mongoose (ODM)
- JWT (authentication)
- Nodemailer (email)
- Joi (validation)

### Data Science
- Python 3.9+
- Pandas (data manipulation)
- NumPy (numerical computing)
- Scikit-learn (ML)
- Matplotlib/Seaborn (visualization)
- BeautifulSoup/Selenium (web scraping)

### Deployment
- Frontend: Vercel
- Backend: Railway/Heroku
- Database: MongoDB Atlas
- Scheduler: Node.js cron

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (admin)
- `PUT /api/jobs/:id` - Update job (admin)
- `DELETE /api/jobs/:id` - Delete job (admin)
- `GET /api/jobs/search` - Search jobs

### Skills
- `GET /api/skills/top` - Top demanded skills
- `GET /api/skills/trends` - Skill trends over time
- `GET /api/skills/:skillId` - Skill details

### Salaries
- `GET /api/salaries/analytics` - Salary statistics
- `GET /api/salaries/by-skill/:skillId` - Salary by skill
- `GET /api/salaries/by-country/:country` - Salary by location

### Predictions
- `GET /api/predictions/skills` - Future skill demand
- `GET /api/predictions/salary` - Salary growth forecast
- `GET /api/predictions/trends` - Emerging technologies

### Users
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/saved-jobs` - Saved jobs
- `POST /api/users/saved-jobs` - Save job
- `DELETE /api/users/saved-jobs/:jobId` - Unsave job

## Database Schema

### User
```
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (jobseeker|recruiter|researcher|admin),
  country: String,
  skills: [String],
  experience: Number,
  savedJobs: [ObjectId],
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Job
```
{
  _id: ObjectId,
  title: String,
  company: String,
  location: String,
  country: String,
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  description: String,
  requiredSkills: [String],
  experienceLevel: String,
  jobType: String (full-time|contract|remote),
  postedDate: Date,
  source: String,
  url: String,
  createdAt: Date
}
```

### Skill
```
{
  _id: ObjectId,
  name: String (unique),
  category: String,
  demand: Number,
  trend: String (increasing|stable|decreasing),
  averageSalary: Number,
  jobCount: Number,
  lastUpdated: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB 5.0+
- Git

### Quick Start

1. **Clone repository**
```bash
git clone <repo-url>
cd African-market-intelligence
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
```

3. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with MongoDB URI and JWT secret
npm run dev
# API runs at http://localhost:5000
```

4. **Data Science Setup**
```bash
cd data-science
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## Development Workflow

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test locally
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Create Pull Request

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway/Heroku)
```bash
git push heroku main
```

### Data Science (Scheduled Job)
- Deploy to Railway/Heroku as background worker
- Configure cron job for daily scraping

## Performance Optimization

- Frontend: Next.js image optimization, code splitting
- Backend: MongoDB indexing, caching with Redis
- Data Science: Batch processing, parallel scraping

## Security

- JWT authentication with refresh tokens
- Password hashing with bcryptjs
- CORS configuration
- Rate limiting on API endpoints
- Environment variables for secrets
- HTTPS only in production

## Monitoring & Logging

- Backend: Morgan for HTTP logging
- Data Science: Scraper logs in MongoDB
- Frontend: Error tracking with Sentry
- Database: MongoDB Atlas monitoring

## Contributing

See CONTRIBUTING.md for guidelines.

## License

MIT License - See LICENSE file

## Support

- Issues: GitHub Issues
- Email: support@jobmarket.ai
- Documentation: /docs
