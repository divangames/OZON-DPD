@echo off
rem Сборка статического сайта.
cd /d "%~dp0"
call npm run build
pause
