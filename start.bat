@echo off
echo ===================================================
echo  XAI SME Workforce Decision Support System
echo  Starting Backend (FastAPI) + Frontend (Next.js)
echo ===================================================
echo.

:: Start FastAPI backend in a new window
echo [1/2] Starting FastAPI inference server on http://localhost:8000 ...
start "XAI Backend - FastAPI" cmd /k "cd /d %~dp0 && .venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000"

:: Short pause to let backend load models
timeout /t 4 /nobreak > nul

:: Start Next.js frontend in a new window
echo [2/2] Starting Next.js frontend on http://localhost:3000 ...
start "XAI Frontend - Next.js" cmd /k "cd /d %~dp0web && npm run dev"

echo.
echo Both services are starting in separate windows.
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000/docs  (FastAPI Swagger)
echo.
pause
