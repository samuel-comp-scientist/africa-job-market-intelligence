# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.jobmarket.ai/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* additional details */ }
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "jobseeker",
  "country": "Nigeria"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "jobseeker",
      "country": "Nigeria"
    },
    "token": "jwt_token_here"
  }
}
```

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

### Logout
```
POST /auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token
```
POST /auth/refresh
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token"
  }
}
```

---

## Job Endpoints

### List All Jobs
```
GET /jobs?page=1&limit=20&country=Nigeria&jobType=full-time
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20, max: 100)
- `country` (string) - Filter by country
- `jobType` (string) - Filter by job type (full-time, contract, remote)
- `minSalary` (number) - Minimum salary
- `maxSalary` (number) - Maximum salary
- `sort` (string) - Sort field (postedDate, salary, relevance)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "job_id",
        "title": "Senior Python Developer",
        "company": "Tech Company",
        "location": "Lagos",
        "country": "Nigeria",
        "salary": {
          "min": 50000,
          "max": 80000,
          "currency": "USD"
        },
        "description": "Job description...",
        "requiredSkills": ["Python", "Django", "PostgreSQL"],
        "experienceLevel": "senior",
        "jobType": "full-time",
        "postedDate": "2024-03-01T10:00:00Z",
        "source": "LinkedIn",
        "url": "https://..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Get Job Details
```
GET /jobs/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job": { /* full job object */ },
    "relatedJobs": [ /* similar jobs */ ]
  }
}
```

### Search Jobs
```
GET /jobs/search?q=python&location=Lagos
```

**Query Parameters:**
- `q` (string) - Search query
- `location` (string) - Location filter
- `skills` (string) - Comma-separated skills
- `country` (string) - Country filter

**Response:** Same as list jobs

### Create Job (Admin)
```
POST /jobs
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "location": "Nairobi",
  "country": "Kenya",
  "salary": {
    "min": 60000,
    "max": 90000,
    "currency": "USD"
  },
  "description": "We are looking for...",
  "requiredSkills": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "senior",
  "jobType": "full-time",
  "url": "https://..."
}
```

### Update Job (Admin)
```
PUT /jobs/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** Same as create job

### Delete Job (Admin)
```
DELETE /jobs/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

---

## Skills Endpoints

### List All Skills
```
GET /skills?page=1&limit=50&category=backend
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `category` (string) - Skill category (backend, frontend, devops, etc.)
- `sort` (string) - Sort by (demand, salary, trend)

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "_id": "skill_id",
        "name": "Python",
        "category": "backend",
        "demand": 89,
        "trend": "increasing",
        "averageSalary": 75000,
        "jobCount": 1250,
        "lastUpdated": "2024-03-01T00:00:00Z"
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

### Get Top Skills
```
GET /skills/top?limit=20&country=Nigeria
```

**Query Parameters:**
- `limit` (number) - Number of top skills (default: 20)
- `country` (string) - Filter by country
- `category` (string) - Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": [ /* top skills */ ]
  }
}
```

### Get Skill Details
```
GET /skills/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "skill": { /* skill object */ },
    "trends": [ /* historical trends */ ],
    "salaryData": { /* salary statistics */ },
    "relatedSkills": [ /* related skills */ ]
  }
}
```

### Get Skill Trends
```
GET /skills/trends?period=6months&country=Nigeria
```

**Query Parameters:**
- `period` (string) - Time period (1month, 3months, 6months, 1year)
- `country` (string) - Country filter
- `category` (string) - Category filter

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "date": "2024-03-01",
        "skill": "Python",
        "demand": 85,
        "jobCount": 1200
      }
    ]
  }
}
```

---

## Salary Endpoints

### Get Salary Analytics
```
GET /salaries/analytics?country=Nigeria&role=Developer
```

**Query Parameters:**
- `country` (string) - Country filter
- `role` (string) - Job role filter
- `experienceLevel` (string) - Experience level filter

**Response:**
```json
{
  "success": true,
  "data": {
    "average": 65000,
    "median": 60000,
    "min": 30000,
    "max": 150000,
    "currency": "USD",
    "distribution": {
      "junior": 45000,
      "mid": 65000,
      "senior": 95000
    },
    "byCountry": { /* salary by country */ },
    "byRole": { /* salary by role */ }
  }
}
```

### Get Salary by Skill
```
GET /salaries/by-skill/:skillId?country=Nigeria
```

**Response:**
```json
{
  "success": true,
  "data": {
    "skill": "Python",
    "average": 75000,
    "median": 70000,
    "min": 40000,
    "max": 150000,
    "jobCount": 1250,
    "trend": "increasing"
  }
}
```

### Get Salary by Role
```
GET /salaries/by-role/:role?country=Nigeria
```

**Response:**
```json
{
  "success": true,
  "data": {
    "role": "Senior Developer",
    "average": 85000,
    "median": 80000,
    "min": 60000,
    "max": 150000,
    "jobCount": 450
  }
}
```

### Get Salary by Country
```
GET /salaries/by-country/:country
```

**Response:**
```json
{
  "success": true,
  "data": {
    "country": "Nigeria",
    "average": 55000,
    "median": 50000,
    "min": 25000,
    "max": 120000,
    "topRoles": [ /* top paying roles */ ],
    "topSkills": [ /* top paying skills */ ]
  }
}
```

### Get Salary Trends
```
GET /salaries/trends?period=1year&country=Nigeria
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "date": "2024-03-01",
        "average": 65000,
        "median": 60000,
        "jobCount": 500
      }
    ]
  }
}
```

---

## Prediction Endpoints

### Get Skill Predictions
```
GET /predictions/skills?months=12&country=Nigeria
```

**Query Parameters:**
- `months` (number) - Forecast period in months (default: 12)
- `country` (string) - Country filter

**Response:**
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "skill": "AI/ML",
        "currentDemand": 45,
        "predictedDemand": 72,
        "growthRate": 60,
        "confidence": 0.85
      }
    ]
  }
}
```

### Get Salary Predictions
```
GET /predictions/salary?months=12&role=Developer&country=Nigeria
```

**Response:**
```json
{
  "success": true,
  "data": {
    "role": "Developer",
    "currentAverage": 65000,
    "predictedAverage": 72000,
    "growthRate": 10.8,
    "confidence": 0.82
  }
}
```

### Get Trend Predictions
```
GET /predictions/trends?months=12
```

**Response:**
```json
{
  "success": true,
  "data": {
    "emergingTechnologies": [
      {
        "technology": "Rust",
        "adoptionRate": 0.35,
        "growthPotential": "high"
      }
    ],
    "decliningTechnologies": [ /* declining tech */ ]
  }
}
```

### Get Career Recommendations
```
GET /predictions/career?userId=user_id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "skill": "Kubernetes",
        "reason": "High demand in your region",
        "demandScore": 85,
        "salaryPotential": 95000,
        "learningResources": [ /* resources */ ]
      }
    ]
  }
}
```

---

## User Endpoints

### Get User Profile
```
GET /users/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "jobseeker",
      "country": "Nigeria",
      "skills": ["Python", "JavaScript"],
      "experience": 5,
      "preferences": { /* user preferences */ }
    }
  }
}
```

### Update User Profile
```
PUT /users/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "skills": ["Python", "JavaScript", "React"],
  "experience": 6,
  "preferences": {
    "jobType": "remote",
    "salaryMin": 60000,
    "countries": ["Nigeria", "Kenya"]
  }
}
```

### Get Saved Jobs
```
GET /users/saved-jobs?page=1&limit=20
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "savedJobs": [ /* job objects */ ],
    "pagination": { /* pagination info */ }
  }
}
```

### Save Job
```
POST /users/saved-jobs
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "jobId": "job_id"
}
```

### Unsave Job
```
DELETE /users/saved-jobs/:jobId
```

**Headers:** `Authorization: Bearer <token>`

### Get Recommendations
```
GET /users/recommendations?limit=10
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [ /* recommended jobs */ ]
  }
}
```

---

## Admin Endpoints

### List All Users
```
GET /admin/users?page=1&limit=50&role=jobseeker
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [ /* user objects */ ],
    "pagination": { /* pagination info */ }
  }
}
```

### Get Platform Analytics
```
GET /admin/analytics
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 5000,
    "totalJobs": 50000,
    "totalSkills": 500,
    "activeUsers": 1200,
    "newUsersThisMonth": 300,
    "jobsAddedThisMonth": 5000,
    "usersByRole": { /* breakdown by role */ },
    "usersByCountry": { /* breakdown by country */ }
  }
}
```

### Get System Logs
```
GET /admin/logs?type=error&limit=100
```

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `type` (string) - Log type (error, warning, info)
- `limit` (number) - Number of logs

### Trigger Scraper
```
POST /admin/scraper/run
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "sources": ["linkedin", "indeed"],
  "countries": ["Nigeria", "Kenya"]
}
```

### Get Scraper Logs
```
GET /admin/scraper/logs?limit=50
```

**Headers:** `Authorization: Bearer <admin_token>`

---

## Rate Limiting

API endpoints are rate-limited:
- **Public endpoints**: 100 requests per hour
- **Authenticated endpoints**: 1000 requests per hour
- **Admin endpoints**: 5000 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1614556800
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Filtering & Sorting

### Filtering
Use query parameters to filter results:
```
GET /jobs?country=Nigeria&jobType=full-time&minSalary=50000
```

### Sorting
Use `sort` parameter with field name and direction:
```
GET /jobs?sort=-postedDate  # Descending
GET /jobs?sort=salary       # Ascending
```

---

## Webhooks (Coming Soon)

Subscribe to events:
- `job.created` - New job posted
- `skill.trending` - Skill trending up
- `salary.updated` - Salary data updated
- `prediction.generated` - New prediction available

---

## SDK & Libraries

### JavaScript/TypeScript
```bash
npm install jobmarket-sdk
```

### Python
```bash
pip install jobmarket-sdk
```

### cURL Examples

**Get top skills:**
```bash
curl -X GET "http://localhost:5000/api/skills/top?limit=10" \
  -H "Content-Type: application/json"
```

**Login:**
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Search jobs:**
```bash
curl -X GET "http://localhost:5000/api/jobs/search?q=python&country=Nigeria" \
  -H "Authorization: Bearer <token>"
```

---

## Support

For API support:
- Email: api-support@jobmarket.ai
- Documentation: https://docs.jobmarket.ai
- Issues: https://github.com/jobmarket/api/issues
