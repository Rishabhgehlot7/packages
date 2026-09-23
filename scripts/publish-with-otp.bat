@echo off
echo.
echo ================================================================
echo   @boostengine: Publish with OTP (2FA)
echo ================================================================
echo.
echo Enter your NPM authenticator OTP when prompted.
echo.
set /p OTP="Enter OTP: "
echo.
echo Publishing all packages with OTP...
node bump-and-publish-otp.cjs %OTP%
