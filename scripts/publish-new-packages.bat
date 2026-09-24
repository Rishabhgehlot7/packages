@echo off
echo.
echo ================================================================
echo   @boostengine: Publish 7 New Packages to NPM
echo ================================================================
echo.
echo (1) Press Enter to publish directly (if no 2FA OTP needed)
echo (2) Or enter your 6-digit NPM OTP if 2FA is enabled
echo.
set /p OTP="Enter OTP (or press Enter): "
echo.
if "%OTP%"=="" (
    node publish-new-packages.cjs
) else (
    node publish-new-packages.cjs %OTP%
)
pause
