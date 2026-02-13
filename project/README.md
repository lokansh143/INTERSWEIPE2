# InternSwipe - AI-Powered Internship Matching Platform

## Project Structure

```
InternSwipe/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
├── ai-services/      # Python/FastAPI AI microservices
├── database/         # Database documentation
├── PROJECT_SETUP.md  # Detailed setup instructions
└── FEATURES.md       # Feature list
```

## Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- PostgreSQL (planned)
- MongoDB (planned)

### Step 1: Setup Backend
```powershell
cd backend
.\setup.ps1
```

### Step 2: Setup Frontend
```powershell
cd frontend
.\setup.ps1
```

### Step 3: Setup AI Services
```powershell
cd ai-services
.\setup.ps1
```

### Step 4: Run All Services

Terminal 1 - Backend:
```powershell
cd backend
npm run dev
```

Terminal 2 - AI Services:
```powershell
cd ai-services
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000
```

Terminal 3 - Frontend:
```powershell
cd frontend
npm start
```

Open http://localhost:3000 in your browser.
