@echo off
setlocal enabledelayedexpansion

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Chrome Web Store Build and Package Script (Windows)
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::
:: This script builds the extension and creates a ZIP package ready for
:: Chrome Web Store submission.
::
:: Usage:
::   build-webstore.bat [version]
::
:: Example:
::   build-webstore.bat 1.0.0
::
:: If no version is provided, it reads from src\manifest.json
::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo.
echo ==============================================================
echo   Chrome Web Store Build ^& Package Script
echo ==============================================================
echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 1. Check prerequisites
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Checking prerequisites...
echo.

:: Check if we're in the right directory
if not exist "src\manifest.json" (
    echo [X] Error: src\manifest.json not found
    echo     Please run this script from the chrome-extension directory
    exit /b 1
)
echo [+] Found src\manifest.json

:: Check if npm is installed
where npm >nul 2>&1
if errorlevel 1 (
    echo [X] Error: npm is not installed
    echo     Please install Node.js and npm first
    exit /b 1
)
echo [+] npm is installed

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [!] node_modules not found, running npm install...
    call npm install
    if errorlevel 1 (
        echo [X] npm install failed
        exit /b 1
    )
    echo [+] Dependencies installed
) else (
    echo [+] node_modules exists
)

echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 2. Get version number
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Determining version...
echo.

if "%~1"=="" (
    :: Extract version from manifest.json
    for /f "tokens=2 delims=:, " %%a in ('findstr /C:"\"version\"" src\manifest.json') do (
        set VERSION=%%a
        set VERSION=!VERSION:"=!
    )
    if "!VERSION!"=="" (
        echo [X] Error: Could not read version from src\manifest.json
        exit /b 1
    )
    echo [*] Version from manifest.json: !VERSION!
) else (
    set VERSION=%~1
    echo [*] Version provided via argument: !VERSION!
)

set PACKAGE_NAME=sip-extension-v!VERSION!.zip
echo [*] Package name: !PACKAGE_NAME!

echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 3. Clean previous builds
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Cleaning previous builds...
echo.

if exist "dist\" (
    echo [*] Removing dist\ directory...
    rmdir /s /q dist
    echo [+] dist\ removed
)

if exist "!PACKAGE_NAME!" (
    echo [*] Removing existing !PACKAGE_NAME!...
    del /q "!PACKAGE_NAME!"
    echo [+] !PACKAGE_NAME! removed
)

:: Remove any other zip files (old versions)
if exist "sip-extension-v*.zip" (
    echo [*] Removing old zip packages...
    del /q sip-extension-v*.zip
    echo [+] Old packages removed
)

echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 4. Run production build
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Building extension...
echo.

echo [*] Running: npm run build
echo.

call npm run build
if errorlevel 1 (
    echo.
    echo [X] Build failed
    exit /b 1
)

echo.
echo [+] Build completed successfully

echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 5. Verify build output
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Verifying build output...
echo.

:: Check if dist\ was created
if not exist "dist\" (
    echo [X] Error: dist\ directory not created
    exit /b 1
)
echo [+] dist\ directory exists

:: Check for required files
set "REQUIRED_FILES=dist\manifest.json dist\background.js dist\offscreen-ua.js dist\offscreen.html dist\options.html dist\options.js"

for %%f in (%REQUIRED_FILES%) do (
    if not exist "%%f" (
        echo [X] Error: Required file missing: %%f
        exit /b 1
    )
)
echo [+] All required files present

:: Check for icons
set "REQUIRED_ICONS=dist\assets\icon16.png dist\assets\icon48.png dist\assets\icon128.png"

for %%i in (%REQUIRED_ICONS%) do (
    if not exist "%%i" (
        echo [X] Error: Required icon missing: %%i
        exit /b 1
    )
)
echo [+] All required icons present

echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 6. Create ZIP package
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Creating ZIP package...
echo.

echo [*] Creating: !PACKAGE_NAME!
echo.

:: Check if PowerShell is available for ZIP creation
where powershell >nul 2>&1
if errorlevel 1 (
    echo [X] Error: PowerShell not found
    echo     PowerShell is required to create ZIP files on Windows
    exit /b 1
)

:: Use PowerShell to create ZIP (excludes .DS_Store, __MACOSX, .map files)
powershell -Command "$files = Get-ChildItem -Path 'dist\*' -Recurse -Exclude '*.DS_Store','*.map','__MACOSX'; Compress-Archive -Path $files.FullName -DestinationPath '!PACKAGE_NAME!' -CompressionLevel Optimal -Force"

if errorlevel 1 (
    echo.
    echo [X] Failed to create ZIP package
    exit /b 1
)

echo.
echo [+] ZIP package created successfully

echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 7. Verify ZIP package
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Verifying ZIP package...
echo.

:: Check if ZIP was created
if not exist "!PACKAGE_NAME!" (
    echo [X] Error: ZIP file not created
    exit /b 1
)
echo [+] ZIP file exists: !PACKAGE_NAME!

:: Get ZIP file size
for %%A in ("!PACKAGE_NAME!") do set ZIP_SIZE=%%~zA
set /a ZIP_SIZE_MB=!ZIP_SIZE! / 1024 / 1024
echo [*] ZIP file size: !ZIP_SIZE! bytes (~!ZIP_SIZE_MB! MB)

:: Check if size is reasonable (< 100MB is Chrome Web Store limit)
if !ZIP_SIZE_MB! gtr 100 (
    echo [!] Warning: ZIP file is larger than 100MB (Chrome Web Store limit)
    echo     You may need to optimize your package
)

:: List ZIP contents using PowerShell
echo.
echo [*] ZIP contents (first 20 files):
echo.
powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('!PACKAGE_NAME!'); $zip.Entries | Select-Object -First 20 | ForEach-Object { Write-Host $_.FullName }"

echo.
echo [+] ZIP package verified

echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 8. Calculate checksums
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Calculating checksums...
echo.

:: Calculate SHA-256 using PowerShell
for /f "delims=" %%H in ('powershell -Command "(Get-FileHash '!PACKAGE_NAME!' -Algorithm SHA256).Hash"') do set SHA256=%%H
echo [*] SHA-256: !SHA256!

echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 9. Summary
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo ==============================================================
echo   [+] Package Ready for Chrome Web Store Submission
echo ==============================================================
echo.
echo Package:     !PACKAGE_NAME!
echo Size:        ~!ZIP_SIZE_MB! MB
echo Version:     !VERSION!
echo SHA-256:     !SHA256:~0,16!...
echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 10. Next steps
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

echo [*] Next Steps:
echo.
echo 1. Verify package contents (optional):
echo    PowerShell: Expand-Archive !PACKAGE_NAME! -DestinationPath .\test-extract
echo.
echo 2. Test package locally (optional):
echo    Extract to a folder, then load in chrome://extensions
echo.
echo 3. Submit to Chrome Web Store:
echo    a. Visit: https://chrome.google.com/webstore/devconsole
echo    b. Click: "New Item"
echo    c. Upload: !PACKAGE_NAME!
echo    d. Fill store listing (use store-assets\store-listing.txt)
echo    e. Upload screenshots and promotional image
echo    f. Submit for review
echo.
echo 4. For detailed submission steps, see:
echo    CHROME_WEBSTORE_PUBLISHING.md
echo    SUBMISSION_CHECKLIST.md
echo.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 11. Asset reminders
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

set SCREENSHOTS_EXIST=1
for /L %%i in (1,1,5) do (
    if not exist "store-assets\screenshots\screenshot-0%%i-*.png" (
        set SCREENSHOTS_EXIST=0
    )
)

set PROMO_EXIST=0
if exist "store-assets\promotional\promo-small-440x280.png" set PROMO_EXIST=1

if !SCREENSHOTS_EXIST! equ 0 (
    echo [!] Asset Reminders:
    echo.
    echo [!] Screenshots not found in store-assets\screenshots\
    echo     You need 5 screenshots (1280x800) for Chrome Web Store
    echo     See: store-assets\SCREENSHOT_GUIDE.md
    echo.
)

if !PROMO_EXIST! equ 0 (
    if !SCREENSHOTS_EXIST! equ 1 echo [!] Asset Reminders:
    echo.
    echo [!] Promotional image not found: store-assets\promotional\promo-small-440x280.png
    echo     You need 1 promotional image (440x280) for Chrome Web Store
    echo     See: store-assets\PROMOTIONAL_IMAGE_GUIDE.md
    echo.
)

if !SCREENSHOTS_EXIST! equ 1 if !PROMO_EXIST! equ 1 (
    echo [*] Assets Status:
    echo.
    echo [+] Screenshots ready (5 found)
    echo [+] Promotional image ready
    echo.
)

echo ==============================================================
echo.
echo [*] Build completed successfully! Package is ready for submission.
echo.

endlocal
