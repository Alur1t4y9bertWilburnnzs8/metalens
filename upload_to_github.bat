@echo off
setlocal enabledelayedexpansion
echo ==========================================
echo       Metalens GitHub Uploader v2
echo ==========================================

set "GIT_CMD=git"

REM 1. Check globally installed git
%GIT_CMD% --version >nul 2>&1
if %errorlevel% equ 0 goto :FOUND

REM 2. Check common paths
echo Global Git not found. Searching common paths...

set "PATHS[1]=C:\Program Files\Git\cmd\git.exe"
set "PATHS[2]=C:\Program Files\Git\bin\git.exe"
set "PATHS[3]=C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd\git.exe"

for /L %%i in (1,1,3) do (
    if exist "!PATHS[%%i]!" (
        set "GIT_CMD="!PATHS[%%i]!""
        echo Found Git at: !GIT_CMD!
        goto :FOUND
    )
)

:NOT_FOUND
echo.
echo [ERROR] Git is REALLY not found.
echo -----------------------------------------------------------
echo Please download and install Git manually:
echo 1. Go to https://git-scm.com/download/win
echo 2. Download and install "64-bit Git for Windows Setup"
echo 3. Run this script again after installation.
echo -----------------------------------------------------------
pause
exit /b

:FOUND
echo.
echo [1/5] Initializing repository...
%GIT_CMD% init

echo.
echo [2/5] Adding files...
%GIT_CMD% add .

echo.
echo [3/5] Committing changes...
%GIT_CMD% commit -m "Initial commit"

echo.
echo [4/5] Setting up main branch...
%GIT_CMD% branch -M main

echo.
echo [5/5] Pushing to GitHub...
%GIT_CMD% remote remove origin >nul 2>&1
%GIT_CMD% remote add origin https://github.com/Alur1t4y9bertWilburnnzs8/metalens.git
echo (Please sign in via the browser window if prompted)
%GIT_CMD% push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ==========================================
    echo       SUCCESS: Project Uploaded!
    echo ==========================================
) else (
    echo.
    echo [FAIL] Upload failed. Please check errors above.
)
pause
