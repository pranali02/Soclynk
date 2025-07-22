@echo off
echo === Simple Backend Deployment ===
echo.

echo 1. Creating canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx canister create onchain360_backend"

echo 2. Building canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx build onchain360_backend || echo Build failed, but continuing..."

echo 3. Installing canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx canister install onchain360_backend --mode reinstall"

echo 4. Setting up environment...
for /f %%i in ('wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx canister id onchain360_backend"') do set CANISTER_ID=%%i
echo VITE_CANISTER_ID=%CANISTER_ID%>.env.local
echo Canister ID: %CANISTER_ID%

echo 5. Generating declarations...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx generate onchain360_backend"

echo.
echo === Deployment Complete ===
echo Your backend should now be connected.
echo.
echo IMPORTANT: Keep the other terminal window open where dfx is running!
pause 