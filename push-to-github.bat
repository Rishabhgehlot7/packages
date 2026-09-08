@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Pushing @boostengine Packages to GitHub Public Repo
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. Initialize git if not already initialized
if not exist ".git" (
  echo [*] Initializing Git repository...
  git init -b main
) else (
  echo [*] Git repository already initialized.
)

:: 2. Stage and commit all package files
echo [*] Staging all files...
git add .

echo [*] Committing files...
git commit -m "feat: release complete @boostengine 15-package eCommerce micro-suite"

:: 3. GitHub CLI or Remote URL
echo.
echo --------------------------------------------------------
echo Choose how you want to push to GitHub:
echo [1] Using GitHub CLI (gh repo create) - Automatic
echo [2] Using an existing GitHub repository URL
echo --------------------------------------------------------
set /p CHOICE="Enter choice (1 or 2): "

if "%CHOICE%"=="1" (
  echo.
  set /p REPO_NAME="Enter repo name (e.g. boostengine-packages or boost-packages): "
  if "!REPO_NAME!"=="" set REPO_NAME=boostengine-packages
  echo [*] Creating and pushing public repo: !REPO_NAME!...
  gh repo create !REPO_NAME! --public --source=. --remote=origin --push
) else (
  echo.
  set /p REMOTE_URL="Enter your GitHub Repository URL (e.g. https://github.com/your-username/repo.git): "
  if not "!REMOTE_URL!"=="" (
    git remote remove origin 2>nul
    git remote add origin !REMOTE_URL!
    git branch -M main
    echo [*] Pushing to GitHub...
    git push -u origin main
  ) else (
    echo [ERROR] No remote URL provided!
  )
)

echo.
echo ========================================================
echo   Finished! Check your GitHub repository.
echo ========================================================
pause
