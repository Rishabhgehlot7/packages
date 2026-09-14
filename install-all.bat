@echo off
echo =======================================================
echo    Boost Commerce Dependency Installer
echo =======================================================
echo.
echo Choose an option:
echo   1. Install dependencies in templates (nextjs, vite, express, expo)
echo   2. Install dependencies in all 22 @boostengine packages
echo   3. Install everything (templates + packages)
echo.
set /p choice="Enter choice [1-3] (Default: 1): "

if "%choice%"=="2" (
  node "%~dp0install-all.cjs" --packages
) else if "%choice%"=="3" (
  node "%~dp0install-all.cjs" --all
) else (
  node "%~dp0install-all.cjs" --templates
)

pause
