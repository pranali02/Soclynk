@echo off
echo ===== Starting OnChain360 Development Environment =====
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

echo Step 3: Creating and deploying backend canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister create onchain360_backend"
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx build onchain360_backend"
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister install onchain360_backend"
echo.

echo Step 4: Starting frontend development server...
wsl -d Ubuntu -- bash -c "cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && npm run dev"
echo.

echo ===== Development Environment Started =====
echo.
pause 