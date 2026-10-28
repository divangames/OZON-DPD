@echo off
rem Сборка и публикация GitHub Pages.
cd /d "%~dp0"
if not exist node_modules call npm ci
if errorlevel 1 exit /b 1
call npm run build
if errorlevel 1 exit /b 1
call npm run deploy:pages
pause
