# Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas account)
- Git

### Step 1: Clone & Navigate
```bash
git clone <repository-url>
cd African-market-intelligence
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
✅ Access at: http://localhost:3000

### Step 3: Backend Setup (New Terminal)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```
✅ API at: http://localhost:5000

### Step 4: Data Science (New Terminal)
```bash
cd data-science
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jobmarket
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Data Science (.env)
```
MONGODB_URI=mongodb://localhost:27017/jobmarket
```

## Common Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run type-check   # Check TypeScript
```

### Backend
```bash
npm run dev          # Start dev server
npm run init-db      # Initialize database
npm test             # Run tests
npm run lint         # Run linter
```

### Data Science
```bash
python main.py       # Run pipeline
python -m pytest     # Run tests
```

## Project Structure

```
├── frontend/         # Next.js dashboard
├── backend/          # Express.js API
├── data-science/     # Python pipeline
└── docs/             # Documentation
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/app/page.tsx` | Landing page |
| `backend/server.js` | API server |
| `data-science/main.py` | Data pipeline |
| `docs/API.md` | API documentation |
| `docs/ARCHITECTURE.md` | System design |
| `SETUP_GUIDE.md` | Detailed setup |

## API Endpoints

### Jobs
- `GET /api/jobs` - List jobs
- `GET /api/jobs/:id` - Job details
- `GET /api/jobs/search` - Search jobs

### Skills
- `GET /api/skills/top` - Top skills
- `GET /api/skills/:id` - Skill details

### Salaries
- `GET /api/salaries/analytics` - Salary stats
- `GET /api/salaries/by-skill/:id` - Salary by skill

### Predictions
- `GET /api/predictions/skills` - Skill forecast
- `GET /api/predictions/salary` - Salary forecast

See `docs/API.md` for complete API reference.

## Database Setup

### Option 1: Local MongoDB
```bash
# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows (PowerShell as Admin)
net start MongoDB
```

### Option 2: MongoDB Atlas
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env` file

## Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :3000  # Frontend
lsof -i :5000  # Backend

# Kill process
kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Check if running
mongosh

# Verify connection string in .env
# For Atlas: Check IP whitelist
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway)
```bash
git push heroku main
```

### Database (MongoDB Atlas)
- Already hosted in cloud
- No deployment needed

## Documentation

- **Setup**: `SETUP_GUIDE.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **API**: `docs/API.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`

## Support

- 📧 Email: support@jobmarket.ai
- 📚 Docs: See `/docs` folder
- 🐛 Issues: GitHub Issues

## Next Steps

1. ✅ Run all three services
2. ✅ Access http://localhost:3000
3. ✅ Check API at http://localhost:5000/api-docs
4. ✅ Read `docs/API.md` for endpoints
5. ✅ Start implementing features

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 19, TypeScript, TailwindCSS |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Data Science | Python, Pandas, NumPy, Scikit-learn |
| Deployment | Vercel, Railway, MongoDB Atlas |

## Performance Tips

- Frontend: Use `npm run build` for production
- Backend: Enable MongoDB indexing
- Data Science: Use batch processing
- All: Monitor with Sentry/DataDog

## Security Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Use strong MongoDB password
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets

---

**Ready to start?** Run the 4 setup steps above and you're good to go! 🚀
