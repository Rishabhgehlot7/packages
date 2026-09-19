@echo off
cd /d "%~dp0"
echo ==============================================
echo Building and Publishing @boostengine/ui
echo ==============================================

call npm run build
if %errorlevel% neq 0 (
  echo Build failed! Exiting...
  exit /b %errorlevel%
)

call npm test
if %errorlevel% neq 0 (
  echo Tests failed! Exiting...
  exit /b %errorlevel%
)

echo Publishing to npm...
call npm publish --access public
echo Finished!
