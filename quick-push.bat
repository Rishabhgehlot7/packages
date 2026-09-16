@echo off
cd /d "%~dp0"

echo ========================================================
echo   Pushing Boost Engine Packages to GitHub
echo   Remote: git@github.com:Rishabhgehlot7/packages.git
echo ========================================================
echo.

echo [*] Staging changes...
git add .

echo [*] Committing changes...
git commit -m "feat(security): harden publish scripts, resolve Rawan findings, and improve BoostEngine UI components"

echo [*] Pushing to GitHub origin main...
git push origin main

echo.
echo ========================================================
echo   Push Complete!
echo ========================================================
pause
