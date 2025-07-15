@echo off
echo Starting dfx local network...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx start --background"
echo dfx network started!
pause 