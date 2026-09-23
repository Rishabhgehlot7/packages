@echo off
cd /d "%~dp0.."

echo ========================================================
echo   Checking NPM Live Downloads for @boostengine Packages
echo ========================================================
echo.

node scripts\check-downloads.cjs

echo.
echo ========================================================
pause
