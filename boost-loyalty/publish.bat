@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   boost-loyalty publish
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 ( echo FAILED: npm install & exit /b 1 )

echo.
echo [2/4] Building (tsup multi-entry)...
call npm run build
if %errorlevel% neq 0 ( echo FAILED: build & exit /b 1 )

echo.
echo [3/4] Running test suite...
call npm test
if %errorlevel% neq 0 ( echo FAILED: tests & exit /b 1 )

echo.
echo [4/4] Publishing to npm...
call npm publish --access public
if %errorlevel% neq 0 ( echo FAILED: publish & exit /b 1 )

echo.
echo ========================================
echo   Published @boostengine/loyalty!
echo ========================================
echo.
