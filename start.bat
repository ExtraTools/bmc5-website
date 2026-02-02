@echo off
chcp 65001 >nul
title BMC5 Website Launcher

echo ============================================
echo           BMC5 Website Launcher
echo ============================================

:: Проверка Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js не найден! Пожалуйста, установите Node.js с https://nodejs.org/
    echo.
    echo После установки перезапустите этот скрипт.
    pause
    exit /b 1
)

cd /d "%~dp0"

:: Проверка наличия модулей
if not exist "node_modules" (
    echo [*] Установка зависимостей (первый запуск)...
    call npm install
    if errorlevel 1 (
        echo [X] Ошибка установки зависимостей. Проверьте интернет.
        pause
        exit /b 1
    )
)

:: Закрытие других экземпляров на порту 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo [*] Закрытие старого процесса на порту 3000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

echo [+] Запуск веб-сервера...
echo [*] Сайт будет доступен по адресу: http://localhost:3000
echo.

:: Открытие сайта в браузере через 3 секунды
timeout /t 3 /nobreak >nul
start http://localhost:3000

:: Запуск сервера
node server.js

pause
