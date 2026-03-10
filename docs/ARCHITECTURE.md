# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (React + TypeScript + TailwindCSS)     │   │
│  │  - Landing Page                                          │   │
│  │  - Authentication (Login/Signup)                         │   │
│  │  - Job Seeker Dashboard                                  │   │
│  │  - Recruiter Dashboard                                   │   │
│  │  - Researcher Dashboard                                  │   │
│  │  - Admin Panel                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js REST API (Node.js)                           │   │
│  │  - Authentication & Authorization                        │   │
│  │  - Request Validation                                    │   │
│  │  - Rate Limiting                                         │   │
│  │  - Error Handling                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Controllers & Services                                  │   │
│  │  - Job Management                                        │   │
│  │  - User Management                                       │   │
│  │  - Analytics & Reporting                                 │   │
│  │  - Predictions                                           │   │
│  │  - Notifications                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Mongoose ODM                                            │   │
│  │  - Schema Validation                                     │   │
│  │  - Query Optimization                                    │   │
│  │  - Indexing                                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Database Layer                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB (Atlas or Local)                                │   │
│  │  - Collections: Users, Jobs, Skills, Salaries, etc.      │   │
│  │  - Indexes for performance                               │   │
│  │  - Replication & Backup                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Data Collection Layer                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Job Scraper (Python)                                      │  │
│  │  - LinkedIn Jobs                                           │  │
│  │  - Indeed                                                  │  │
│  │  - RemoteOK                                                │  │
│  │  - AngelList                                               │  │
│  │  - Local African Job Boards                                │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    Data Processing Layer                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Data Analyzer (Python)                                    │  │
│  │  - Data Cleaning (Pandas)                                  │  │
│  │  - Deduplication                                           │  │
│  │  - Normalization                                           │  │
│  │  - Feature Engineering                                     │  │
│  │  - Validation                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    ML/Analytics Layer                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Skill Predictor (Scikit-learn)                            │  │
│  │  - Skill Demand Forecasting                                │  │
│  │  - Salary Trend Analysis                                   │  │
│  │  - Emerging Technology Detection                           │  │
│  │  - Career Path Recommendations                             │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    Data Storage Layer                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  MongoDB Collections                                       │  │
│  │  - Raw Jobs                                                │  │
│  │  - Processed Skills                                        │  │
│  │  - Analytics Results                                       │  │
│  │  - Predictions                                             │  │
│  │  - Scraper Logs                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### User Authentication Flow
```
User Input (Login/Signup)
        ↓
Frontend Form Validation
        ↓
POST /api/auth/login or /api/auth/register
        ↓
Backend Validation Middleware
        ↓
Password Hashing (bcryptjs)
        ↓
Database Query/Insert
        ↓
JWT Token Generation
        ↓
Response with Token
        ↓
Frontend Stores Token (localStorage)
        ↓
Token Sent in Authorization Header for Subsequent Requests
```

### Job Search Flow
```
User Search Query
        ↓
Frontend Sends GET /api/jobs/search?query=...
        ↓
Backend Query Builder
        ↓
MongoDB Full-Text Search
        ↓
Results Aggregation
        ↓
Response with Pagination
        ↓
Frontend Renders Results
        ↓
User Selects Job
        ↓
GET /api/jobs/:id
        ↓
Detailed Job View
```

### Analytics Generation Flow
```
Scheduled Scraper Runs (Daily)
        ↓
Collects Job Postings
        ↓
Data Cleaning & Processing
        ↓
Skill Extraction & Normalization
        ↓
Salary Analysis
        ↓
Trend Calculation
        ↓
ML Model Predictions
        ↓
Results Stored in MongoDB
        ↓
Frontend Queries /api/skills/top, /api/salaries/analytics
        ↓
Dashboard Visualization
```

## Database Schema Relationships

```
User (1) ──────────────────────────── (Many) SavedJobs
  │
  ├─ (1) ──────────────────────────── (Many) Applications
  │
  └─ (1) ──────────────────────────── (Many) Notifications

Job (1) ──────────────────────────── (Many) Applications
  │
  ├─ (Many) ──────────────────────── (Many) Skills
  │
  └─ (1) ──────────────────────────── (1) Company

Skill (1) ──────────────────────────── (1) SkillTrends
  │
  └─ (1) ──────────────────────────── (1) SalaryAnalytics

Company (1) ──────────────────────── (Many) Jobs
  │
  └─ (1) ──────────────────────────── (1) CompanyAnalytics

Prediction (1) ──────────────────────────── (1) Skill
```

## API Endpoint Architecture

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/forgot-password   - Password reset request
POST   /api/auth/reset-password    - Reset password
```

### Job Endpoints
```
GET    /api/jobs                   - List all jobs (paginated)
GET    /api/jobs/:id               - Get job details
GET    /api/jobs/search            - Search jobs with filters
POST   /api/jobs                   - Create job (admin)
PUT    /api/jobs/:id               - Update job (admin)
DELETE /api/jobs/:id               - Delete job (admin)
```

### Skills Endpoints
```
GET    /api/skills                 - List all skills
GET    /api/skills/top             - Top 20 demanded skills
GET    /api/skills/:id             - Skill details
GET    /api/skills/trends          - Skill trends over time
GET    /api/skills/by-country/:country - Skills by location
```

### Salary Endpoints
```
GET    /api/salaries/analytics     - Overall salary statistics
GET    /api/salaries/by-skill/:id  - Salary by skill
GET    /api/salaries/by-role/:role - Salary by job role
GET    /api/salaries/by-country/:country - Salary by location
GET    /api/salaries/trends        - Salary trends over time
```

### Prediction Endpoints
```
GET    /api/predictions/skills     - Future skill demand
GET    /api/predictions/salary     - Salary growth forecast
GET    /api/predictions/trends     - Emerging technologies
GET    /api/predictions/career     - Career path recommendations
```

### User Endpoints
```
GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update profile
GET    /api/users/saved-jobs       - Get saved jobs
POST   /api/users/saved-jobs       - Save job
DELETE /api/users/saved-jobs/:id   - Unsave job
GET    /api/users/recommendations  - Get recommendations
```

### Admin Endpoints
```
GET    /api/admin/users            - List all users
GET    /api/admin/jobs             - List all jobs
GET    /api/admin/analytics        - Platform analytics
GET    /api/admin/logs             - System logs
POST   /api/admin/scraper/run      - Trigger scraper
GET    /api/admin/scraper/logs     - Scraper logs
```

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (npm run dev)
├── Backend (npm run dev)
├── Data Science (python main.py)
└── MongoDB (local or Atlas)
```

### Production Environment
```
┌─────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Frontend (Vercel)                           │
│  - Next.js Static Generation                            │
│  - Automatic Deployments                                │
│  - Global Edge Network                                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (Railway/Heroku)                    │
│  - Express.js API                                       │
│  - Auto-scaling                                         │
│  - Environment Variables                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Database (MongoDB Atlas)                    │
│  - Managed MongoDB                                      │
│  - Automatic Backups                                    │
│  - Replication                                          │
│  - Monitoring                                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Data Science (Railway Worker)               │
│  - Scheduled Scraping                                   │
│  - ML Model Training                                    │
│  - Analytics Generation                                 │
└─────────────────────────────────────────────────────────┘
```

## Security Architecture

### Authentication & Authorization
```
User Credentials
        ↓
Password Hashing (bcryptjs)
        ↓
JWT Token Generation
        ↓
Token Stored in HttpOnly Cookie (secure)
        ↓
Token Sent in Authorization Header
        ↓
Middleware Verification
        ↓
Role-Based Access Control (RBAC)
        ↓
Resource Access
```

### Data Protection
- HTTPS/TLS encryption in transit
- MongoDB encryption at rest
- Password hashing with bcryptjs
- JWT for stateless authentication
- CORS configuration
- Rate limiting on API endpoints
- Input validation and sanitization

## Performance Optimization

### Frontend
- Next.js Image Optimization
- Code Splitting
- Lazy Loading
- Caching Strategies
- Compression

### Backend
- MongoDB Indexing
- Query Optimization
- Caching (Redis)
- Pagination
- Compression (gzip)

### Data Science
- Batch Processing
- Parallel Scraping
- Incremental Updates
- Model Caching

## Monitoring & Logging

### Frontend
- Error tracking (Sentry)
- Performance monitoring
- User analytics

### Backend
- HTTP request logging (Morgan)
- Error logging
- Database query logging
- Performance metrics

### Data Science
- Scraper logs
- Model training logs
- Data quality metrics

## Scalability Considerations

1. **Horizontal Scaling**
   - Load balancer for backend
   - Multiple API instances
   - Database replication

2. **Vertical Scaling**
   - Increase server resources
   - Database optimization
   - Caching layer

3. **Data Scaling**
   - Database sharding
   - Archive old data
   - Incremental processing

## Disaster Recovery

- Automated MongoDB backups
- Database replication
- Code version control (Git)
- Environment variable backups
- Monitoring and alerts
