@echo off
echo ==============================================
echo Building @boostengine/ui Universal Package
echo ==============================================

call npm run build
if %errorlevel% neq 0 (
  echo ❌ Build failed! Exiting...
  exit /b %errorlevel%
)

call npm test
if %errorlevel% neq 0 (
  echo ❌ Tests failed! Exiting...
  exit /b %errorlevel%
)

echo ✅ All builds and tests passed successfully!
pause
