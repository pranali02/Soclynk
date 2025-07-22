@echo off
echo ===== Fixing WSL Permission Issues =====
echo.

echo Step 1: Stopping any running dfx processes...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx stop"
timeout /t 3 /nobreak > nul
echo.

echo Step 2: Copying project to WSL home directory...
wsl -d Ubuntu -- bash -c "mkdir -p ~/onchain360_project"
wsl -d Ubuntu -- bash -c "cp -rf /mnt/c/Users/HP/Desktop/ONCHAIN360/* ~/onchain360_project/"
echo.

echo Step 3: Starting dfx in WSL home directory...
wsl -d Ubuntu -- bash -c "cd ~/onchain360_project && dfx start --clean --background"
echo - Waiting for replica to initialize...
timeout /t 15 /nobreak > nul
echo.

echo Step 4: Creating and deploying backend canister...
wsl -d Ubuntu -- bash -c "cd ~/onchain360_project && dfx canister create onchain360_backend"
wsl -d Ubuntu -- bash -c "cd ~/onchain360_project && dfx build onchain360_backend"
wsl -d Ubuntu -- bash -c "cd ~/onchain360_project && dfx canister install onchain360_backend"
echo.

echo Step 5: Getting canister ID and creating environment files...
for /f %%i in ('wsl -d Ubuntu -- bash -c "cd ~/onchain360_project && dfx canister id onchain360_backend"') do set CANISTER_ID=%%i
echo VITE_CANISTER_ID=%CANISTER_ID%>.env.local
echo - Set canister ID: %CANISTER_ID%
echo.

echo Step 6: Copying declarations back to Windows...
wsl -d Ubuntu -- bash -c "cp -rf ~/onchain360_project/src/declarations/* /mnt/c/Users/HP/Desktop/ONCHAIN360/src/declarations/"
wsl -d Ubuntu -- bash -c "cp -f ~/onchain360_project/.dfx/local/canister_ids.json /mnt/c/Users/HP/Desktop/ONCHAIN360/.dfx/local/"
echo.

echo ===== WSL Permissions Fixed =====
echo.
echo The backend is now running properly in the WSL filesystem.
echo Your frontend should be able to connect to the backend at http://127.0.0.1:4943
echo.
echo IMPORTANT: 
echo 1. Keep this window open to maintain the dfx connection
echo 2. You can now restart your frontend with: npm run dev
echo.

pause 