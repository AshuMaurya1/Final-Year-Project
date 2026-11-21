@echo off
setlocal
cd /d "%~dp0"

title AKGEC TrafficAI - Professional Startup
color 0A
echo ======================================================================
echo    AI-Based Traffic Congestion Prediction ^& Dynamic Signal Control
echo    Final-Year Engineering Project ^| AKGEC
echo ======================================================================
echo.
echo [1/3] Verifying runtime environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required to run this project.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Preparing frontend assets...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    call npm --prefix frontend install
)
if not exist "frontend\dist\index.html" (
    echo Building frontend bundle...
    call npm --prefix frontend run build
)

echo [3/3] Starting AKGEC TrafficAI server...
echo Dashboard URL: http://localhost:8000
echo API Status: http://localhost:8000/api/intersection/status
echo.
echo Press Ctrl+C in this window to stop the server.
start http://localhost:8000
call npm start
pause
