@echo off
echo.
echo ================================================================
echo   🚀 Publish create-boost-app to NPM
echo ================================================================
echo.
cd /d "%~dp0\create-boost-app"

set /p OTP="Enter 6-digit NPM OTP (or press Enter if no 2FA): "

if "%OTP%"=="" (
    echo.
    echo Publishing create-boost-app without OTP...
    npm publish --access public
) else (
    echo.
    echo Publishing create-boost-app with OTP %OTP%...
    npm publish --access public --otp=%OTP%
)

if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================================
    echo   SUCCESS! create-boost-app is now LIVE on NPM!
    echo   Test with: npx create-boost-app@latest
    echo ================================================================
) else (
    echo.
    echo [ERROR] Publish failed. If version exists, run "npm version patch" first.
)
echo.
pause
