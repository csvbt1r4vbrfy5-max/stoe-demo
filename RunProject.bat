@echo off
:: تلوين النص باللون الأزرق السماوي (Cyan) لخلفية سوداء
color 0b

echo ==========================================
echo    جاري تشغيل مشروع المتجر (Store Demo)
echo ==========================================
echo.

:: الانتقال لمجلد الويب
echo [1/4] الانتقال لمجلد المشروع (web)...
cd /d "%~dp0web"
if %errorlevel% neq 0 (
    echo [خطأ] لم يتم العثور على مجلد web!
    pause
    exit /b %errorlevel%
)

:: تثبيت المكتبات
echo [2/4] التأكد من تثبيت المكتبات (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo [خطأ] فشل تثبيت المكتبات!
    pause
    exit /b %errorlevel%
)

:: تحديث Prisma
echo [3/4] تحديث ملفات Prisma (prisma generate)...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [خطأ] فشل تحديث Prisma!
    pause
    exit /b %errorlevel%
)

:: بدء التشغيل
echo [4/4] بدء تشغيل خادم التطوير (npm run dev)...
echo.
echo ------------------------------------------
echo    المشروع سيعمل الآن على: http://localhost:3000
echo ------------------------------------------
echo.
call npm run dev

:: في حال توقف المشروع لأي سبب
if %errorlevel% neq 0 (
    echo.
    echo [تنبيه] توقف المشروع بشكل غير متوقع.
)

pause
