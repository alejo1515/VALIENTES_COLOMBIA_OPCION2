@echo off
:: Configurar el título de la ventana
title Consola de Sincronizacion - Valientes Colombia
chcp 65001 > nul
cls

echo ======================================================
echo          VALIENTES COLOMBIA - SISTEMA DE DATOS        
echo ======================================================
echo.
echo [1/3] Descargando la base de datos mas reciente de GitHub...
echo ------------------------------------------------------
:: Forzar la descarga para asegurarse de que tiene lo ultimo de sus compañeras
git pull origin main
echo ------------------------------------------------------
echo.

echo [2/3] Abriendo la aplicacion de control...
echo NO cierres esta ventana negra. Al cerrar la aplicacion, tus cambios se guardaran.
echo.

:: 🛠️ MODIFICA ESTA LÍNEA SEGÚN CÓMO EJECUTAS TU APP:
 ::start "" "ValientesColombia.exe"
:: Si lo corres con Node de forma local, descomenta la siguiente linea y comenta la del .exe:
npm start

echo.
echo ------------------------------------------------------
echo [3/3] Guardando y subiendo tus nuevos datos a GitHub...
echo ------------------------------------------------------

:: Agregar solo el archivo de la base de datos (reemplaza 'database/valientes.sqlite' por tu ruta real)
git add database/valientes.sqlite

:: Crear un commit automático con la fecha y hora actual del cambio
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%b-%%a)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a:%%b)

git commit -m "Actualizacion de datos automatica - %mydate% %mytime%"

:: Subir los datos al repositorio privado
git push origin main

echo ------------------------------------------------------
echo.
echo ¡Proceso terminado con exito! Datos respaldados en la nube.
echo Ya puedes cerrar esta ventana.
echo ======================================================
pause