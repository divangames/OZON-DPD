@echo off
rem Главное меню запуска и публикации сайта OZON x DPD.
chcp 65001 >nul
cd /d "%~dp0"
:menu
cls
echo.
echo   OZON x DPD
echo.
echo   1. Запуск локально
echo   2. Открыть сайт на GitHub Pages
echo   3. Коммит, пуш и деплой на GitHub Pages
echo   4. Деплой на GitHub Pages
echo   5. Деплой на VPS
echo   0. Выход
echo.
set "choice="
set /p "choice=Выберите действие: "
if "%choice%"=="1" goto run
if "%choice%"=="2" goto open
if "%choice%"=="3" goto commit
if "%choice%"=="4" goto deploy
if "%choice%"=="5" goto vps
if "%choice%"=="0" exit /b
goto menu
:install
if exist node_modules\vite\package.json exit /b 0
call npm ci
exit /b %errorlevel%
:run
call :install
if errorlevel 1 goto failed
call npm run dev -- --open
goto done
:open
start "" "https://divangames.github.io/OZON-DPD/"
goto done
:commit
set "message="
set /p "message=Описание коммита (Enter: Update website): "
if not defined message set "message=Update website"
call :install
if errorlevel 1 goto failed
call npm run build
if errorlevel 1 goto failed
git add --all
if errorlevel 1 goto failed
git diff --cached --quiet
if errorlevel 1 git commit -m "%message%"
if errorlevel 1 goto failed
git push -u origin main
if errorlevel 1 goto failed
goto publish
:deploy
call :install
if errorlevel 1 goto failed
call npm run build
if errorlevel 1 goto failed
:publish
call npm run deploy:pages
if errorlevel 1 goto failed
echo Готово. GitHub Pages может обновляться несколько минут.
goto done
:vps
call :install
if errorlevel 1 goto failed
call npm run build
if errorlevel 1 goto failed
call npm run deploy:vps
if errorlevel 1 goto failed
goto done
:failed
echo Ошибка. Публикация остановлена. Подробности выше.
:done
pause
goto menu
