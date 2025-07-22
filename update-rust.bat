@echo off
echo ===== Fixing Backend by Updating Rust in WSL =====
echo.

echo Step 1: Stopping any running dfx processes...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx stop"
timeout /t 3 /nobreak > nul
echo.

echo Step 2: Updating Rust in WSL...
echo - This will take a few minutes, please wait...
wsl -d Ubuntu -- bash -c "rustup update stable"
wsl -d Ubuntu -- bash -c "rustc --version"
echo.

echo Step 3: Starting fresh dfx replica...
start /b wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx start --clean"
echo - Waiting for replica to initialize...
timeout /t 15 /nobreak > nul
echo.

echo Step 4: Creating canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister create onchain360_backend"
echo.

echo Step 5: Building backend canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx build onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed! Trying alternative approach...
    echo - Modifying Cargo.toml to use older versions...
    goto :alternative
)
echo.

echo Step 6: Installing backend canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister install onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Installation failed!
    goto :failure
)
echo.

echo Step 7: Getting canister ID and creating environment files...
for /f %%i in ('wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister id onchain360_backend"') do set CANISTER_ID=%%i
echo VITE_CANISTER_ID=%CANISTER_ID%>.env.local
echo - Set canister ID: %CANISTER_ID%
echo.

echo Step 8: Generating TypeScript declarations...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx generate onchain360_backend"
echo.

echo ===== Backend Fixed Successfully! =====
echo.
echo The frontend development server should now be able to connect to the backend.
echo If you need to restart the frontend, run: npm run dev
echo.
echo IMPORTANT: Keep this window open to maintain the dfx connection.
echo.
goto :end

:alternative
echo.
echo ===== Trying Alternative Approach =====
echo.
echo Updating Cargo.toml to use compatible versions...

echo Step A1: Updating workspace dependencies...
wsl -d Ubuntu -- bash -c "cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && sed -i 's/ic-cdk = \"0.8.3\"/ic-cdk = \"0.7.4\"/g' Cargo.toml"
wsl -d Ubuntu -- bash -c "cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && sed -i 's/ic-cdk-macros = \"0.6.10\"/ic-cdk-macros = \"0.6.0\"/g' Cargo.toml"
echo.

echo Step A2: Updating Cargo.lock...
wsl -d Ubuntu -- bash -c "cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && cargo update"
echo.

echo Step A3: Building backend canister again...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx build onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed even after modifying dependencies!
    goto :failure
)
echo.

echo Step A4: Installing backend canister...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister install onchain360_backend"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Installation failed!
    goto :failure
)
echo.

echo Step A5: Getting canister ID and creating environment files...
for /f %%i in ('wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx canister id onchain360_backend"') do set CANISTER_ID=%%i
echo VITE_CANISTER_ID=%CANISTER_ID%>.env.local
echo - Set canister ID: %CANISTER_ID%
echo.

echo Step A6: Generating TypeScript declarations...
wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd /mnt/c/Users/HP/Desktop/ONCHAIN360 && dfx generate onchain360_backend"
echo.

echo ===== Backend Fixed Successfully with Alternative Approach! =====
echo.
echo The frontend development server should now be able to connect to the backend.
echo If you need to restart the frontend, run: npm run dev
echo.
echo IMPORTANT: Keep this window open to maintain the dfx connection.
echo.
goto :end

:failure
echo.
echo ===== Backend Fix Failed =====
echo.
echo Please try one of these approaches:
echo 1. Update your Rust installation manually in WSL with: rustup update stable
echo 2. Install a newer version of WSL Ubuntu with: wsl --install -d Ubuntu-22.04
echo 3. Try directly modifying src/onchain360_backend/Cargo.toml to use compatible versions
echo.

:end
pause 