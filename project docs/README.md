# African Job Market Intelligence Platform

## Problem Statement

The African tech job market is rapidly growing but lacks comprehensive data-driven insights for:
- Job seekers to understand in-demand skills
- Companies to benchmark salary expectations
- Educational institutions to align curriculum with market needs
- Policymakers to understand tech employment trends

This platform analyzes tech job postings across Africa to provide actionable intelligence on skill demands, salary trends, and future job market predictions.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Job Scraper   │───▶│  Data Science  │───▶│   MongoDB DB    │
│    (Python)     │    │   Pipeline      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │◀───│  Express.js     │◀───│   MongoDB DB    │
│   Dashboard     │    │   REST API      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Components

1. **Job Scraper (Python)**: Automated web scraping of African job boards
2. **Data Science Pipeline**: Data cleaning, analysis, and AI predictions
3. **REST API (Node.js/Express)**: Backend API serving processed data
4. **Dashboard (Next.js)**: Frontend visualization and analytics
5. **Database (MongoDB)**: Centralized data storage

## Installation Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (v5.0+)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd African-market-intelligence
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

3. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

4. **Data Science Setup**
```bash
cd data-science
pip install -r requirements.txt
```

5. **Database Setup**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Create database and collections (handled by backend)
```

## Project Structure

```
African-market-intelligence/
├── frontend/                 # Next.js dashboard
│   ├── components/          # React components
│   ├── pages/              # Next.js pages
│   ├── styles/             # TailwindCSS styles
│   └── utils/              # Helper functions
├── backend/                 # Express.js API
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── middleware/         # Express middleware
├── data-science/           # Python data pipeline
│   ├── scraper/            # Job scraping scripts
│   ├── analysis/           # Data analysis scripts
│   ├── models/             # ML prediction models
│   └── utils/              # Python utilities
├── docs/                   # Documentation
└── README.md              # This file
```

## Usage

### Running the Application

1. Start MongoDB service
2. Run the data scraping pipeline:
```bash
cd data-science
python main.py
```

3. Start the backend API:
```bash
cd backend
npm run dev
```

4. Start the frontend dashboard:
```bash
cd frontend
npm run dev
```

5. Access the dashboard at `http://localhost:3000`

### API Endpoints

- `GET /api/jobs` - Fetch all job postings
- `GET /api/skills/top` - Get top demanded skills
- `GET /api/salaries/analytics` - Get salary statistics
- `GET /api/trends/predictions` - Get AI predictions

## Features

### Dashboard Visualizations
- **Top Demanded Skills**: Bar chart of most requested technical skills
- **Salary Trends**: Line charts showing salary evolution by skill
- **Job Distribution**: Geographic distribution across African countries
- **Skill Demand Charts**: Interactive charts with filtering options

### AI Predictions
- Future skill demand trends
- Salary growth predictions
- Emerging technology identification

## Screenshots

*Coming soon - Add screenshots after implementation*

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation for API changes
- Ensure data privacy compliance

## Technology Stack

### Frontend
- **Next.js 14**: React framework with TypeScript
- **TailwindCSS**: Utility-first CSS framework
- **Chart.js/Recharts**: Data visualization
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling

### Data Science
- **Python**: Programming language
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Matplotlib/Seaborn**: Data visualization
- **Scikit-learn**: Machine learning

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or suggestions, please open an issue or contact the development team.

---

**Note**: This platform is designed to provide insights and should not be used as the sole basis for career or business decisions.
