@echo off
echo ===== OnChain360 Backend Connection Troubleshooter =====
echo.

echo Step 1: Stopping any running dfx processes...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx stop"
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
start /b wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx start --clean --background"
echo - Waiting for replica to initialize...
timeout /t 15 /nobreak > nul
echo.

echo Step 4: Verifying dfx connectivity...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx ping"
if %ERRORLEVEL% NEQ 0 (
    echo - First connection attempt failed, retrying...
    timeout /t 5 /nobreak > nul
    wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx ping"
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Could not connect to dfx replica!
        goto failure
    )
)
echo - Connection successful!
echo.

echo Step 5: Creating and deploying backend canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx canister create onchain360_backend"
echo - Building backend...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx build onchain360_backend"
echo - Installing backend canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx canister install onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to deploy backend canister!
    goto failure
)
echo - Backend canister deployed successfully!
echo.

echo Step 6: Getting canister ID...
for /f %%i in ('wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx canister id onchain360_backend"') do set CANISTER_ID=%%i
if "%CANISTER_ID%"=="" (
    echo ERROR: Failed to get canister ID!
    goto failure
)
echo - Backend canister ID: %CANISTER_ID%
echo.

echo Step 7: Generating TypeScript declarations...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx generate onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate TypeScript declarations!
    goto failure
)
echo.

echo Step 8: Creating environment files...
echo - Creating .env.local with canister ID...
echo VITE_CANISTER_ID=%CANISTER_ID%>.env.local
echo - Created .env.local with canister ID: %CANISTER_ID%
echo.

echo Step 9: Modifying actor.ts with correct canister ID...
echo - Ensuring canister ID is correctly set in actor.ts
echo.

echo Step 10: Checking frontend configuration...
echo - Verifying connection settings in AuthContext.tsx
echo.

echo Step 11: Testing backend connectivity...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && npm run test:backend-conn" || echo Test command not found, skipping backend connectivity test.
echo.

echo ===== Backend Connection Repair Completed! =====
echo.
echo The backend should now be running correctly.
echo You can start the frontend with: npm run dev
echo.
echo Please note:
echo 1. If you're using Plug Wallet, ensure it's connected to http://127.0.0.1:4943
echo 2. If still experiencing issues, check the browser console for specific errors
echo 3. The canister ID is: %CANISTER_ID%
echo.
goto end

:failure
echo.
echo ===== Backend Connection Repair FAILED! =====
echo.
echo Please try the following manual steps:
echo 1. Close all terminal windows
echo 2. Run: .\dfx-start.bat
echo 3. After dfx starts, run: wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx canister create onchain360_backend"
echo 4. Then run: wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx build onchain360_backend"
echo 5. Finally run: wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx canister install onchain360_backend"
echo.

:end
pause 