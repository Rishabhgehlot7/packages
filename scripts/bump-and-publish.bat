@echo off
cd /d "%~dp0.."
echo =================================================================
echo   Bumping versions and publishing all packages to Public NPM
echo =================================================================
node bump-and-publish.cjs
pause
