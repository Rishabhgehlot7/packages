@echo off
echo ========================================================
echo  Boost Engine Analytics - 1-Click NPM Publish
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Building package...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [!] Build failed. Please fix compilation errors before publishing.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] Checking npm login status...
call npm whoami
if %errorlevel% neq 0 (
    echo.
    echo [!] You are not logged into npm. Please run: npm login
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] Publishing to npm publicly...
call npm publish --access public
if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  SUCCESS! Package published to npm publicly!
    echo ========================================================
) else (
    echo.
    echo [!] Publish failed. Please check error message above.
)

echo.
pause
