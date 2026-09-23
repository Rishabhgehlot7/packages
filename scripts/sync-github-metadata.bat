@echo off
cd /d "%~dp0.."

echo ========================================================
echo   Syncing All Package Metadata to Rishabhgehlot7
echo ========================================================
echo.

node scripts\sync-github-metadata.cjs

echo.
echo ========================================================
echo   Metadata Sync Complete!
echo ========================================================
pause
