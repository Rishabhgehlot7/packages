@echo off
echo ==============================================
echo Testing and Publishing create-boost-app
echo ==============================================

call npm test
if %errorlevel% neq 0 (
  echo Tests failed! Exiting...
  exit /b %errorlevel%
)

echo Publishing to npm...
call npm publish --access public
echo Finished!
