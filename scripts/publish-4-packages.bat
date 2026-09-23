@echo off
cd /d "%~dp0"

echo ================================================================
echo   Publish 4 Packages to Public NPM
echo   (@boostengine/returns, analytics, notifications, referrals)
echo ================================================================
echo.

set /p OTP="Enter NPM 2FA OTP (press Enter if no OTP): "

if "%OTP%"=="" (
  node publish-4-packages.cjs
) else (
  node publish-4-packages.cjs %OTP%
)

echo.
pause
