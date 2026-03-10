# African Job Market Intelligence Platform - Scraper System

## 🚀 Overview

This is a comprehensive job scraping system designed to collect high-quality African job market data from multiple sources. The system provides structured data extraction, intelligent data cleaning, and automated scheduling for continuous data collection.

## 📊 Features

### Multi-Source Scraping
- **LinkedIn Jobs** - Professional tech positions
- **Jobberman** - Nigeria-focused job board
- **BrighterMonday** - Kenya-focused job board  
- **MyJobMag** - Nigeria job listings
- **Glassdoor** - International jobs with African locations
- **Indeed** - Broad job search with African filters

### Intelligent Data Processing
- **Skill Extraction** - NLP-powered skill identification
- **Salary Normalization** - Multi-currency salary parsing
- **Location Intelligence** - Country/city extraction and normalization
- **Duplicate Detection** - Advanced duplicate job identification
- **Data Quality Scoring** - Automatic quality assessment

### Automated Operations
- **Scheduled Scraping** - Daily, weekly, and hourly operations
- **Real-time Monitoring** - Live scraper status and statistics
- **Error Handling** - Comprehensive error recovery and logging
- **Dataset Generation** - Automatic analytics dataset creation

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Sources   │───▶│   Job Scrapers   │───▶│   MongoDB DB    │
│ (LinkedIn, etc) │    │ (Puppeteer/Axios)│    │ (Jobs/Companies)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Data Processing  │
                       │ (Cleaning/NLP)   │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Datasets      │
                       │ (Analytics)     │
                       └──────────────────┘
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install puppeteer axios cheerio node-cron
```

2. Create datasets directory:
```bash
mkdir -p backend/datasets
```

3. Start the server:
```bash
npm run dev
```

## 📡 API Endpoints

### Scraper Management
- `GET /api/admin/scrapers` - Get all scraper statuses
- `POST /api/admin/scrapers/start-all` - Start full scraping operation
- `POST /api/admin/scrapers/:id/run` - Start individual scraper
- `POST /api/admin/scrapers/:id/stop` - Stop individual scraper
- `GET /api/admin/scraping/stats` - Get scraping statistics

### Data Quality
- `GET /api/admin/data-quality` - Get data quality metrics
- `POST /api/admin/data-quality/check` - Run data quality check

### Scheduler Management
- `GET /api/admin/scheduler/status` - Get scheduler status
- `POST /api/admin/scheduler/start-all` - Start all schedules
- `POST /api/admin/scheduler/stop-all` - Stop all schedules
- `POST /api/admin/scheduler/:name/start` - Start specific schedule
- `POST /api/admin/scheduler/:name/stop` - Stop specific schedule

## 📅 Schedules

### Daily Schedule (2:00 AM)
- Scrapes top 3 sources (LinkedIn, Jobberman, BrighterMonday)
- Updates critical job data
- Runs automatically every day

### Weekly Schedule (Sunday 3:00 AM)
- Full scraping operation from all sources
- Complete dataset refresh
- Comprehensive data cleaning

### Hourly Schedule (Every Hour)
- Data quality checks
- Duplicate detection
- Dataset updates

## 🎯 Data Structure

### Job Document
```json
{
  "jobTitle": "Backend Developer",
  "company": "TechCorp Africa",
  "country": "Nigeria",
  "city": "Lagos",
  "jobDescription": "We are looking for...",
  "jobUrl": "https://example.com/job/123",
  "salaryMin": 2000,
  "salaryMax": 4000,
  "currency": "USD",
  "skills": ["Python", "Docker", "AWS"],
  "postedDate": "2026-03-08T00:00:00Z",
  "scrapedAt": "2026-03-08T00:00:00Z",
  "source": "linkedin",
  "isActive": true
}
```

### Company Document
```json
{
  "name": "TechCorp Africa",
  "country": "Nigeria",
  "city": "Lagos",
  "industry": "Technology",
  "website": "https://techcorp.com",
  "description": "Leading tech company in Africa",
  "isActive": true
}
```

## 📈 Analytics Datasets

### Jobs Dataset (`datasets/jobs_dataset.json`)
All job postings with structured fields for analytics.

### Skills Dataset (`datasets/skills_dataset.json`)
Skill demand statistics and popularity rankings.

### Salary Dataset (`datasets/salary_dataset.json`)
Salary insights by skill, location, and experience level.

### Trends Dataset (`datasets/trends_dataset.json`)
Historical skill demand trends over time.

## 🔧 Configuration

### Environment Variables
```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/african_job_market

# JWT Secret
JWT_SECRET=your-secret-key

# Scraper Settings
PUPPETEER_SKIP_DOWNLOAD=true
```

### Scraper Sources Configuration
Edit `scrapers/AfricanJobScraper.js` to modify sources:
```javascript
this.sources = [
  {
    name: 'linkedin',
    baseUrl: 'https://www.linkedin.com/jobs/search',
    country: 'africa',
    enabled: true
  },
  // Add more sources...
];
```

## 🚨 Error Handling

The system includes comprehensive error handling:

- **Network Errors** - Automatic retry with exponential backoff
- **Parsing Errors** - Fallback to alternative parsing methods
- **Database Errors** - Transaction rollback and logging
- **Rate Limiting** - Automatic delays between requests

## 📊 Monitoring

### Real-time Statistics
- Total jobs collected
- Jobs by source
- Jobs by country
- Top skills demand
- Data quality score

### Quality Metrics
- Duplicate detection rate
- Missing data percentage
- Spam detection results
- Completeness scores

## 🔮 Future Enhancements

### Advanced Features
- **Machine Learning** - Skill demand prediction
- **Real-time Updates** - WebSocket-based live updates
- **Geographic Visualization** - Interactive job maps
- **Salary Prediction** - AI-powered salary estimation

### Additional Sources
- **Company Career Pages** - Direct company scraping
- **Professional Networks** - Industry-specific platforms
- **Government Job Portals** - Public sector opportunities
- **Freelance Platforms** - Gig economy data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests and documentation
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the error logs in the console
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check scraper source availability

---

**Built with ❤️ for African Job Market Intelligence**
