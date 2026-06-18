@echo off
title Consola de Sincronizacion (DESARROLLO) - Valientes Colombia
chcp 65001 > nul
cls

echo ======================================================
echo    VALIENTES COLOMBIA - SISTEMA DE DATOS (DESARROLLO)  
echo ======================================================
echo.
echo [1/3] Descargando la base de datos mas reciente de GitHub...
echo ------------------------------------------------------
:: Descarga los cambios de tus compañeras antes de iniciar el entorno
git pull origin main
echo ------------------------------------------------------
echo.

echo [2/3] Abriendo el entorno de desarrollo (Electron)...
echo La consola ejecutará el proceso en caliente. No la cierres.
echo.

:: 📌 EJECUCIÓN EN DESARROLLO: Corre la app usando npm start directamente desde tu código fuente
call npm start

echo ------------------------------------------------------
echo [3/3] Guardando y subiendo tus nuevos datos a GitHub...
echo ------------------------------------------------------

:: 📌 RUTA LOCAL: Agrega la base de datos de tu carpeta de trabajo
git add database/valientes.sqlite

:: Captura la fecha y hora exacta con PowerShell de manera limpia
for /f "delims=" %%i in ('powershell -command "Get-Date -Format 'yyyy-MM-dd HH:mm'"') do set datetime=%%i
git commit -m "Actualizacion de datos automatica (Desarrollo) - %datetime%"

:: Sube los archivos al repositorio de pruebas o producción configurado
git push origin main

echo ------------------------------------------------------
echo ¡Proceso terminado con exito! Datos respaldados en la nube.
echo ======================================================
timeout /t 5