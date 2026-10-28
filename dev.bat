@echo off
rem Запуск локального сервера разработки.
cd /d "%~dp0"
if not exist node_modules call npm ci
if errorlevel 1 exit /b 1
call npm run dev -- --open
