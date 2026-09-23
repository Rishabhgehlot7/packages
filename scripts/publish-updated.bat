@echo off
cd /d "%~dp0.."

echo ================================================================
echo   Publish Updated Packages to Public NPM
echo   (@boostengine/ui, @boostengine/seo, @boostengine/server)
echo ================================================================
echo.

set /p OTP="Enter NPM 2FA OTP (press Enter if no OTP): "

if "%OTP%"=="" (
  node publish-updated.cjs
) else (
  node publish-updated.cjs %OTP%
)

echo.
pause
