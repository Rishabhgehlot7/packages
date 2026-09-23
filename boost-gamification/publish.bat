@echo off
setlocal

echo =============================================================
echo   BoostEngine Packages Publisher: @boostengine/gamification
echo =============================================================
echo.

cd /d "%~dp0"

echo [1/4] Cleaning previous builds...
if exist dist rmdir /s /q dist

echo [2/4] Building production bundles with tsup...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed! Aborting publish.
    exit /b %ERRORLEVEL%
)

echo [3/4] Running automated test suite...
call npm test
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Tests failed! Aborting publish.
    exit /b %ERRORLEVEL%
)

echo [4/4] Publishing to NPM public registry...
call npm publish --access public
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm publish failed!
    exit /b %ERRORLEVEL%
)

echo.
echo =============================================================
echo   SUCCESS! @boostengine/gamification published successfully!
echo =============================================================
endlocal
