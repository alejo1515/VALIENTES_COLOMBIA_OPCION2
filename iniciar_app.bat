@echo off
title Consola de Sincronizacion - Valientes Colombia
chcp 65001 > nul
cls

echo ======================================================
echo           VALIENTES COLOMBIA - SISTEMA DE DATOS        
echo ======================================================
echo.
echo [1/3] Descargando la base de datos mas reciente de GitHub...
echo ------------------------------------------------------
git pull origin main
echo ------------------------------------------------------
echo.

echo [2/3] Abriendo la aplicacion de control...
echo La consola se ocultará en el fondo para proteger tus datos.
echo.

:: 📌 AQUÍ ESTÁ EL TRUCO: Ejecuta 'npm start' de forma totalmente invisible de fondo
:: y detiene el archivo .bat en una espera silenciosa hasta que cierres Electron.
powershell -windowstyle hidden -command "npm start"

echo ------------------------------------------------------
echo [3/3] Guardando y subiendo tus nuevos datos a GitHub...
echo ------------------------------------------------------

git add database/valientes.sqlite

for /f "delims=" %%i in ('powershell -command "Get-Date -Format 'yyyy-MM-dd HH:mm'"') do set datetime=%%i
git commit -m "Actualizacion de datos automatica - %datetime%"

git push origin main

echo ------------------------------------------------------
echo ¡Proceso terminado con exito! Datos respaldados.