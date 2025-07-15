@echo off
echo ===== OnChain360 Backend Connection Troubleshooter (WSL) =====
echo.

echo Step 1: Stopping any running dfx processes...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx stop"
timeout /t 3 /nobreak > nul
echo.

echo Step 2: Cleaning local state...
if exist .dfx\local\canisters\onchain360_backend (
    echo - Found existing canister data, backing up...
    if not exist .dfx-backup mkdir .dfx-backup
    xcopy /s /i /y .dfx\local\canisters\onchain360_backend .dfx-backup\onchain360_backend > nul
)
echo - Removing .dfx local state...
if exist .dfx\local rd /s /q .dfx\local
echo.

echo Step 3: Starting fresh dfx replica...
start /b wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx start --clean"
echo - Waiting for replica to initialize...
timeout /t 10 /nobreak > nul
echo.

echo Step 4: Verifying dfx connectivity...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx ping"
if %ERRORLEVEL% NEQ 0 (
    echo - First connection attempt failed, retrying...
    timeout /t 5 /nobreak > nul
    wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx ping"
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Could not connect to dfx replica!
        goto failure
    )
)
echo - Connection successful!
echo.

echo Step 5: Deploying backend canister...
echo - Installing onchain360_backend...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx deploy onchain360_backend --mode=reinstall"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to deploy backend canister!
    goto failure
)
echo - Backend canister deployed successfully!
echo.

echo Step 6: Getting canister ID...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister id onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to get canister ID!
    goto failure
)
echo.

echo Step 7: Generating TypeScript declarations...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx generate onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate TypeScript declarations!
    goto failure
)
echo.

echo Step 8: Creating environment file...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx generate"
echo.

echo Step 9: Creating .env.local with canister ID...
set CANISTER_ID=
for /f %%i in ('wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister id onchain360_backend"') do set CANISTER_ID=%%i
if "%CANISTER_ID%"=="" (
    echo WARNING: Could not get canister ID for .env file
) else (
    echo VITE_CANISTER_ID=%CANISTER_ID%>.env.local
    echo - Created .env.local with canister ID: %CANISTER_ID%
)
echo.

echo ===== Backend Connection Repair Completed! =====
echo.
echo The backend should now be running correctly.
echo You can start the frontend with: npm run dev
echo.
echo If you're still experiencing issues:
echo 1. Check browser console for specific error messages
echo 2. Verify the canister ID in src/services/actor.ts
echo 3. Make sure the frontend is using the correct port (4943)
echo.
goto end

:failure
echo.
echo ===== Backend Connection Repair FAILED! =====
echo.
echo Please try the following manual steps:
echo 1. Close all terminal windows
echo 2. Run: .\dfx-start.bat
echo 3. After dfx starts, run: .\dfx-status.bat
echo 4. Then run: npm run dev
echo.

:end
pause 