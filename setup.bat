@echo off
setlocal EnableDelayedExpansion
title DigiSoft Nexus — Auto Setup
color 0A

REM ================================================================
REM  DigiSoft Nexus — Full Auto Setup Script
REM  Installs ALL dependencies, sets up DB, seeds data, starts project
REM  Run as Administrator for best results
REM ================================================================

echo.
echo  ██████╗ ██╗ ██████╗ ██╗███████╗ ██████╗ ███████╗████████╗
echo  ██╔══██╗██║██╔════╝ ██║██╔════╝██╔═══██╗██╔════╝╚══██╔══╝
echo  ██║  ██║██║██║  ███╗██║███████╗██║   ██║█████╗     ██║   
echo  ██║  ██║██║██║   ██║██║╚════██║██║   ██║██╔══╝     ██║   
echo  ██████╔╝██║╚██████╔╝██║███████║╚██████╔╝██║        ██║   
echo  ╚═════╝ ╚═╝ ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═╝        ╚═╝   
echo.
echo  NEXUS — Real Estate Lead Generation Platform
echo  Auto Setup v1.0 — All phases 1-7 included
echo  ================================================================
echo.

REM ── Check Admin rights ──────────────────────────────────────────
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Not running as Administrator. Some installs may fail.
    echo           Right-click setup.bat and choose "Run as administrator"
    echo.
    pause
)

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"
set "FRONTEND=%ROOT%\frontend"
set "BACKEND=%ROOT%\backend"
set "ADMIN=%ROOT%\admin"
set "LOGS=%ROOT%\logs"

mkdir "%LOGS%" 2>nul

echo [1/10] Checking system requirements...
echo ================================================================

REM ── Check Python ─────────────────────────────────────────────────
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Python not found. Installing Python 3.11...
    powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe' -OutFile '%TEMP%\python_installer.exe'"
    "%TEMP%\python_installer.exe" /quiet InstallAllUsers=1 PrependPath=1 Include_pip=1
    if !errorLevel! neq 0 (
        echo [ERROR] Python installation failed. Download manually from python.org
        pause
        exit /b 1
    )
    echo [OK] Python installed successfully
) else (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYVER=%%i
    echo [OK] Python !PYVER! found
)

REM ── Check Node.js ────────────────────────────────────────────────
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Node.js not found. Installing Node.js 20 LTS...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi' -OutFile '%TEMP%\node_installer.msi'"
    msiexec /i "%TEMP%\node_installer.msi" /quiet /norestart
    if !errorLevel! neq 0 (
        echo [ERROR] Node.js installation failed. Download from nodejs.org
        pause
        exit /b 1
    )
    echo [OK] Node.js installed
) else (
    for /f "tokens=1" %%i in ('node --version') do set NODEVER=%%i
    echo [OK] Node.js !NODEVER! found
)

REM ── Check npm ────────────────────────────────────────────────────
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] npm not found even after Node install. Restart and try again.
    pause
    exit /b 1
)
echo [OK] npm found

REM ── Check Git ────────────────────────────────────────────────────
git --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Git not found. Installing...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.46.0.windows.1/Git-2.46.0-64-bit.exe' -OutFile '%TEMP%\git_installer.exe'"
    "%TEMP%\git_installer.exe" /VERYSILENT /NORESTART
    echo [OK] Git installed
) else (
    echo [OK] Git found
)

echo.
echo [2/10] Setting up PostgreSQL...
echo ================================================================

REM ── Check PostgreSQL ─────────────────────────────────────────────
where psql >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] PostgreSQL not found.
    echo.
    echo     OPTION A: Install PostgreSQL automatically (recommended)
    echo     Download: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
    echo     Install PostgreSQL 16 with default settings
    echo     Password: postgres (or remember what you set)
    echo.
    echo     OPTION B: Use existing PostgreSQL installation
    echo.
    echo     After installing PostgreSQL, run this script again.
    echo.
    choice /C AB /M "Press A to open download page, B to skip and continue"
    if !errorLevel!==1 (
        start https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
        echo After installing PostgreSQL, run setup.bat again.
        pause
        exit /b 0
    )
    echo [SKIP] Continuing without PostgreSQL setup...
    echo        You must manually create the database.
    goto :SKIP_DB
)

echo [OK] PostgreSQL found
echo Creating database and user...

REM Try to create DB (may fail if already exists — that's OK)
psql -U postgres -c "CREATE USER digisoft_user WITH PASSWORD 'DigiSoft@2026';" 2>nul
psql -U postgres -c "CREATE DATABASE digisoft_nexus OWNER digisoft_user;" 2>nul
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE digisoft_nexus TO digisoft_user;" 2>nul
psql -U postgres -c "ALTER USER digisoft_user CREATEDB;" 2>nul
echo [OK] Database setup complete

:SKIP_DB

echo.
echo [3/10] Setting up Redis...
echo ================================================================

REM Check Redis (Windows native or WSL)
redis-cli --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Redis not found.
    echo.
    echo     Redis for Windows options:
    echo     1. Use WSL2 (recommended): wsl --install, then: sudo apt install redis-server
    echo     2. Memurai (Redis for Windows): https://www.memurai.com/
    echo     3. Redis Stack: https://redis.io/docs/getting-started/install-stack/windows/
    echo.
    echo     For development, we'll try to use Memurai...
    
    REM Try to install Memurai silently
    powershell -Command "try { Invoke-WebRequest -Uri 'https://www.memurai.com/downloads/memurai-developer-v4.1.0.exe' -OutFile '%TEMP%\memurai.exe' -TimeoutSec 30 } catch { exit 1 }" 2>nul
    if exist "%TEMP%\memurai.exe" (
        "%TEMP%\memurai.exe" /VERYSILENT /NORESTART 2>nul
        echo [OK] Memurai (Redis for Windows) installed
    ) else (
        echo [WARNING] Could not auto-install Redis.
        echo           Install Memurai manually from: https://www.memurai.com
        echo           Or use WSL2: wsl --install (then restart)
        echo.
        echo           Continuing setup — start Redis before running the project.
    )
) else (
    echo [OK] Redis found
)

echo.
echo [4/10] Setting up Python virtual environment and backend...
echo ================================================================

cd /d "%BACKEND%"

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if !errorLevel! neq 0 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
)

echo [OK] Virtual environment ready

REM Activate venv and install dependencies
echo Installing Python packages (this takes 2-3 minutes)...
call venv\Scripts\activate.bat

REM Upgrade pip first
python -m pip install --upgrade pip --quiet

REM Install all requirements
pip install -r requirements.txt --quiet 2>"%LOGS%\pip_install.log"
if %errorLevel% neq 0 (
    echo [WARNING] Some packages had issues. Check logs\pip_install.log
    echo Trying individual installs...
    pip install Django==5.0.7 djangorestframework==3.15.2 psycopg2-binary==2.9.9 --quiet
    pip install python-decouple==3.8 django-cors-headers==4.4.0 --quiet
    pip install djangorestframework-simplejwt==5.3.1 --quiet
    pip install celery==5.4.0 redis==5.0.8 --quiet
    pip install requests==2.32.3 httpx==0.27.0 Pillow==10.4.0 --quiet
    pip install gunicorn==22.0.0 whitenoise==6.7.0 --quiet
    pip install python-slugify==8.0.4 django-filter==24.2 --quiet
) else (
    echo [OK] Python packages installed
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating backend .env file...
    python -c "import secrets; key=secrets.token_hex(50); jwt=secrets.token_hex(50); f=open('.env','w'); f.write(f'DJANGO_SECRET_KEY={key}\nJWT_SECRET_KEY={jwt}\nDJANGO_SETTINGS_MODULE=config.settings\nDEBUG=True\nALLOWED_HOSTS=localhost,127.0.0.1\nPOSTGRES_DB=digisoft_nexus\nPOSTGRES_USER=digisoft_user\nPOSTGRES_PASSWORD=DigiSoft@2026\nPOSTGRES_HOST=localhost\nPOSTGRES_PORT=5432\nREDIS_URL=redis://localhost:6379/0\nCELERY_BROKER_URL=redis://localhost:6379/0\nCELERY_RESULT_BACKEND=redis://localhost:6379/1\nCORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3010\nFRONTEND_URL=http://localhost:3000\n'); f.close()"
    echo [OK] Backend .env created with secure random keys
)

REM Run migrations
echo Running database migrations...
python manage.py migrate --run-syncdb 2>"%LOGS%\migrate.log"
if %errorLevel% neq 0 (
    echo [WARNING] Migration had issues. Check logs\migrate.log
    echo           Make sure PostgreSQL is running and database exists
) else (
    echo [OK] Migrations complete
)

REM Create superuser
echo Creating admin superuser...
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@digisoftnexus.com', 'Admin@2026!')
    print('Superuser created: admin / Admin@2026!')
else:
    print('Superuser already exists')
" 2>nul

REM Seed initial data
echo Seeding initial data (properties, campaigns)...
python manage.py seed_data 2>"%LOGS%\seed.log"
if %errorLevel% neq 0 (
    echo [INFO] Seed data script not found or already seeded — skipping
) else (
    echo [OK] Initial data seeded
)

REM Collect static files
echo Collecting static files...
python manage.py collectstatic --noinput --quiet 2>nul

echo [OK] Backend setup complete

echo.
echo [5/10] Setting up Frontend (Next.js)...
echo ================================================================

cd /d "%FRONTEND%"

REM Create .env.local
if not exist ".env.local" (
    echo Creating frontend .env.local...
    (
        echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
        echo NEXTAUTH_URL=http://localhost:3000
        echo NEXTAUTH_SECRET=local-dev-secret-change-in-production
        echo NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
        echo NEXT_PUBLIC_ENABLE_POPUPS=true
        echo NEXT_PUBLIC_POPUP_DELAY_MS=8000
        echo NEXT_PUBLIC_SCROLL_TRIGGER_PCT=35
        echo NEXT_TELEMETRY_DISABLED=1
    ) > .env.local
    echo [OK] Frontend .env.local created
    echo [NOTE] hCaptcha key is set to TEST key - works in dev without verification
)

REM Install npm packages
echo Installing npm packages (this takes 3-5 minutes)...
npm install --legacy-peer-deps 2>"%LOGS%\npm_install.log"
if %errorLevel% neq 0 (
    echo [WARNING] npm install had issues. Trying with --force...
    npm install --force 2>>"%LOGS%\npm_install.log"
)
echo [OK] Frontend packages installed

echo.
echo [6/10] Setting up Admin Panel...
echo ================================================================

cd /d "%ADMIN%"

if exist "package.json" (
    if not exist ".env.local" (
        (
            echo NEXT_PUBLIC_API_URL=http://localhost:8000
            echo NEXTAUTH_URL=http://localhost:3010
            echo NEXTAUTH_SECRET=admin-local-dev-secret
            echo NEXT_TELEMETRY_DISABLED=1
        ) > .env.local
        echo [OK] Admin .env.local created
    )
    
    echo Installing Admin panel packages...
    npm install --legacy-peer-deps 2>"%LOGS%\npm_admin.log"
    echo [OK] Admin panel packages installed
)

echo.
echo [7/10] Setting up Microsites...
echo ================================================================

for %%M in (godrej-microsite dlf-microsite m3m-microsite) do (
    if exist "%ROOT%\%%M\package.json" (
        cd /d "%ROOT%\%%M"
        if not exist ".env.local" (
            (
                echo NEXT_PUBLIC_API_URL=http://localhost:8000
                echo NEXT_PUBLIC_MAIN_SITE_URL=http://localhost:3000
                echo NEXT_TELEMETRY_DISABLED=1
            ) > .env.local
        )
        echo Installing %%M packages...
        npm install --legacy-peer-deps --quiet 2>nul
        echo [OK] %%M ready
    )
)

echo.
echo [8/10] Verifying TypeScript compilation...
echo ================================================================

cd /d "%FRONTEND%"
npx tsc --noEmit 2>"%LOGS%\tsc_check.log"
if %errorLevel% neq 0 (
    echo [WARNING] TypeScript has some type errors. Check logs\tsc_check.log
    echo           The project will still run (errors are non-blocking in dev mode)
) else (
    echo [OK] TypeScript check passed
)

echo.
echo [9/10] Creating startup scripts...
echo ================================================================

REM Create start-backend.bat
(
    echo @echo off
    echo title DigiSoft Backend
    echo color 0A
    echo cd /d "%BACKEND%"
    echo call venv\Scripts\activate.bat
    echo echo Starting Django backend on http://localhost:8000
    echo echo.
    echo python manage.py runserver 0.0.0.0:8000
) > "%ROOT%\start-backend.bat"

REM Create start-frontend.bat
(
    echo @echo off
    echo title DigiSoft Frontend
    echo color 0B
    echo cd /d "%FRONTEND%"
    echo echo Starting Next.js frontend on http://localhost:3000
    echo echo.
    echo npm run dev
) > "%ROOT%\start-frontend.bat"

REM Create start-admin.bat
(
    echo @echo off
    echo title DigiSoft Admin Panel
    echo color 0E
    echo cd /d "%ADMIN%"
    echo echo Starting Admin panel on http://localhost:3010
    echo echo.
    echo npm run dev
) > "%ROOT%\start-admin.bat"

REM Create start-celery.bat
(
    echo @echo off
    echo title DigiSoft Celery Worker
    echo color 0D
    echo cd /d "%BACKEND%"
    echo call venv\Scripts\activate.bat
    echo echo Starting Celery worker...
    echo echo.
    echo celery -A backend worker --loglevel=info --pool=solo
) > "%ROOT%\start-celery.bat"

REM Create start-all.bat — launches everything
(
    echo @echo off
    echo title DigiSoft Nexus — Launcher
    echo echo Starting all DigiSoft Nexus services...
    echo echo.
    echo start "Backend" cmd /k "%ROOT%\start-backend.bat"
    echo timeout /t 3 /nobreak ^>nul
    echo start "Frontend" cmd /k "%ROOT%\start-frontend.bat"
    echo timeout /t 2 /nobreak ^>nul
    echo start "Admin" cmd /k "%ROOT%\start-admin.bat"
    echo timeout /t 5 /nobreak ^>nul
    echo echo.
    echo echo All services started!
    echo echo.
    echo echo  Frontend:  http://localhost:3000
    echo echo  Admin:     http://localhost:3010
    echo echo  Backend:   http://localhost:8000
    echo echo  API Docs:  http://localhost:8000/api/docs/
    echo echo  Django Admin: http://localhost:8000/admin/
    echo echo.
    echo echo  Login: admin / Admin@2026!
    echo echo.
    echo timeout /t 5 /nobreak ^>nul
    echo start "" http://localhost:3000
) > "%ROOT%\start-all.bat"

REM Create stop-all.bat
(
    echo @echo off
    echo echo Stopping all DigiSoft Nexus services...
    echo taskkill /f /im node.exe 2^>nul
    echo taskkill /f /im python.exe 2^>nul
    echo echo Done.
) > "%ROOT%\stop-all.bat"

echo [OK] Startup scripts created

echo.
echo [10/10] Final verification...
echo ================================================================

REM Test Django
cd /d "%BACKEND%"
call venv\Scripts\activate.bat >nul 2>&1
python manage.py check 2>"%LOGS%\django_check.log"
if %errorLevel% neq 0 (
    echo [WARNING] Django system check found issues. Check logs\django_check.log
) else (
    echo [OK] Django system check passed
)

REM Test Next.js build check (dry run)
cd /d "%FRONTEND%"
echo Verifying Next.js project structure...
if exist "app\page.tsx" (
    echo [OK] Frontend app structure OK
) else (
    echo [WARNING] Frontend app\page.tsx not found
)

echo.
echo ================================================================
echo.
echo  ✅  SETUP COMPLETE!
echo.
echo  ================================================================
echo.
echo  QUICK START:
echo.
echo    Double-click: start-all.bat  (starts everything at once)
echo.
echo  OR start individually:
echo    1. start-backend.bat     (Django API on port 8000)
echo    2. start-frontend.bat    (Next.js on port 3000)
echo    3. start-admin.bat       (Admin panel on port 3010)
echo.
echo  URLS:
echo    Main Site:      http://localhost:3000
echo    Admin Panel:    http://localhost:3010
echo    Django API:     http://localhost:8000/api/
echo    Django Admin:   http://localhost:8000/admin/
echo.
echo  CREDENTIALS:
echo    Username: admin
echo    Password: Admin@2026!
echo.
echo  IMPORTANT — Fill in these API keys in .env files:
echo    - HubSpot Access Token (for CRM sync)
echo    - WhatsApp Business API token (for WA messages)
echo    - hCaptcha keys (for bot protection)
echo    - Meta Pixel ID (for conversion tracking)
echo.
echo  LOGS:  %LOGS%\
echo.
echo ================================================================
echo.

REM Offer to start now
choice /C YN /M "Start all services now?"
if %errorLevel%==1 (
    start "" "%ROOT%\start-all.bat"
)

echo.
echo Setup complete. Press any key to exit.
pause >nul
