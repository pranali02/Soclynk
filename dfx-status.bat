@echo off
echo Checking dfx status...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx ping"
echo.
echo Deploying backend only...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx build onchain360_backend"
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister install onchain360_backend --mode upgrade || dfx canister install onchain360_backend --mode reinstall"
echo.
echo Backend deployment complete!
echo Canister ID:
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister id onchain360_backend"
pause 