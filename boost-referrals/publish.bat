@echo off
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║     @boostengine/referrals — Publish Pipeline    ║
echo ╚══════════════════════════════════════════════════╝
echo.
echo [1/4] Installing deps...
call npm install
echo.
echo [2/4] Building...
call npm run build
if %errorlevel% neq 0 (echo ❌ Build failed & exit /b 1)
echo.
echo [3/4] Running tests...
call npm test
if %errorlevel% neq 0 (echo ❌ Tests failed & exit /b 1)
echo.
echo [4/4] Publishing to npm...
call npm publish --access public
echo.
echo ✅ @boostengine/referrals published successfully!
echo.
