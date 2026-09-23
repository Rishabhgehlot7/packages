@echo off
echo ========================================================
echo Publishing @boostengine/subscriptions to NPM Registry
echo ========================================================

call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Build failed! Aborting publish.
  exit /b %ERRORLEVEL%
)

call npm test
if %ERRORLEVEL% NEQ 0 (
  echo Tests failed! Aborting publish.
  exit /b %ERRORLEVEL%
)

echo Publishing package...
call npm publish --access public

echo ========================================================
echo @boostengine/subscriptions published successfully!
echo ========================================================
