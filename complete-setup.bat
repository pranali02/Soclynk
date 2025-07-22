@echo off
echo ===== OnChain360 Complete Setup Script =====
echo.

echo This script will:
echo 1. Start dfx replica
echo 2. Set up the backend connection
echo 3. Start the frontend with proper integration
echo 4. Provide debugging tools
echo.

echo Press any key to continue...
pause > nul

echo.
echo Step 1: Stopping any running processes...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx stop" 2>nul
taskkill /F /IM node.exe 2>nul
echo.

echo Step 2: Starting dfx replica...
start /b wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx start --clean"
echo - Waiting for replica to initialize...
timeout /t 20 /nobreak > nul
echo.

echo Step 3: Testing dfx connectivity...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx ping"
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: DFX connection issues detected.
    echo The frontend will run with limited backend functionality.
    echo.
) else (
    echo - DFX replica is running successfully!
)
echo.

echo Step 4: Setting up environment variables...
echo VITE_CANISTER_ID=uxrrr-q7777-77774-qaaaq-cai>.env.local
echo VITE_DFX_HOST=http://127.0.0.1:4943>>.env.local
echo VITE_NODE_ENV=development>>.env.local
echo - Environment variables configured
echo.

echo Step 5: Starting frontend development server...
start /b cmd /c "cd C:\Users\HP\Desktop\ONCHAIN360 && npm run dev"
echo - Waiting for frontend to start...
timeout /t 10 /nobreak > nul
echo.

echo Step 6: Opening application in browser...
start http://localhost:5173
echo.

echo ===== Setup Complete! =====
echo.
echo Your Soclynk application is now running:
echo - Frontend: http://localhost:5173
echo - Backend: http://127.0.0.1:4943
echo.
echo IMPORTANT NOTES:
echo 1. Keep this window open to maintain connections
echo 2. If backend functionality is limited, that's expected
echo 3. The frontend will work with mock data if needed
echo 4. You can use Plug Wallet to test authentication
echo.
echo Debugging URLs:
echo - DFX Status: http://127.0.0.1:4943/_/status
echo - Backend Test: Open backend-test.html in your browser
echo.

:loop
echo [R] Restart services  [S] Check status  [Q] Quit
set /p choice="Choose an option: "

if /i "%choice%"=="R" goto restart
if /i "%choice%"=="S" goto status
if /i "%choice%"=="Q" goto end
goto loop

:restart
echo Restarting services...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx stop"
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak > nul
start /b wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx start"
timeout /t 15 /nobreak > nul
start /b cmd /c "cd C:\Users\HP\Desktop\ONCHAIN360 && npm run dev"
echo Services restarted!
goto loop

:status
echo Checking status...
echo.
echo DFX Status:
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx ping" || echo "DFX not responding"
echo.
echo Frontend Status:
curl -s http://localhost:5173 > nul && echo "Frontend is running" || echo "Frontend not responding"
echo.
echo Backend Test:
curl -s http://127.0.0.1:4943/_/status > nul && echo "Backend replica is running" || echo "Backend replica not responding"
echo.
goto loop

:end
echo.
echo Stopping services...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx stop" 2>nul
echo.
echo Thank you for using OnChain360!
pause 