@echo off
echo ===== OnChain360 Backend Connection Script =====
echo.

echo This script will:
echo 1. Stop any running dfx processes
echo 2. Start a fresh dfx replica
echo 3. Deploy the backend canister
echo 4. Create necessary environment files
echo 5. Start the frontend development server
echo.

echo Press any key to continue or CTRL+C to cancel...
pause > nul

echo.
echo Step 1: Stopping any running dfx processes...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx stop"
timeout /t 3 /nobreak > nul
echo.

echo Step 2: Starting fresh dfx replica...
start /b wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx start --clean"
echo - Waiting for replica to initialize...
timeout /t 15 /nobreak > nul
echo.

echo Step 3: Testing dfx connection...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx ping"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Could not connect to dfx replica!
    echo Please make sure WSL is properly installed and configured.
    echo You may need to run: wsl --install
    echo.
    goto failure
)
echo - Connection successful!
echo.

echo Step 4: Creating and deploying backend canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister create onchain360_backend"
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx build onchain360_backend"
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister install onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to deploy backend canister!
    echo Please check the error messages above for more information.
    echo.
    goto failure
)
echo.

echo Step 5: Getting canister ID and creating environment files...
for /f %%i in ('wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister id onchain360_backend"') do set CANISTER_ID=%%i
echo VITE_CANISTER_ID=%CANISTER_ID%>.env.local
echo - Set canister ID: %CANISTER_ID%
echo.

echo Step 6: Generating TypeScript declarations...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx generate onchain360_backend"
echo.

echo Step 7: Starting frontend development server...
start /b cmd /c "cd C:\Users\HP\Desktop\ONCHAIN360 && npm run dev"
echo.

echo ===== Backend Connected Successfully! =====
echo.
echo The frontend development server has been started.
echo You can now access the application at: http://localhost:5173
echo.
echo IMPORTANT: Keep this window open to maintain the dfx connection.
echo.
goto end

:failure
echo.
echo ===== ERROR: Backend Connection Failed =====
echo.
echo Try running fix-backend.bat to resolve the issue.
echo.

:end
pause 