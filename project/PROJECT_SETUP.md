# Project Setup

## Backend

```powershell
cd backend
.\setup.ps1
npm run dev
```

## AI Services

```powershell
cd ai-services
.\setup.ps1
python -m uvicorn main:app --reload --port 8000
```

## Frontend

```powershell
cd frontend
.\setup.ps1
npm start
```
