@echo off
echo Starting dfx local network...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/SOCLYNK && dfx start --clean"
echo dfx network started!
pause 