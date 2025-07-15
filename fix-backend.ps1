# OnChain360 Backend Connection Troubleshooter
Write-Host "===== OnChain360 Backend Connection Troubleshooter =====" -ForegroundColor Cyan
Write-Host

Write-Host "Step 1: Stopping any running dfx processes..." -ForegroundColor Yellow
if (Test-Path '.\dfx') {
    try {
        .\dfx stop
        Write-Host "- Successfully stopped dfx" -ForegroundColor Green
    } catch {
        Write-Host "- No running dfx processes found" -ForegroundColor Gray
    }
}
Start-Sleep -Seconds 3
Write-Host

Write-Host "Step 2: Cleaning local state..." -ForegroundColor Yellow
if (Test-Path '.dfx\local\canisters\onchain360_backend') {
    Write-Host "- Found existing canister data, backing up..." -ForegroundColor Gray
    if (-not (Test-Path '.dfx-backup')) {
        New-Item -Path '.dfx-backup' -ItemType Directory | Out-Null
    }
    Copy-Item -Path '.dfx\local\canisters\onchain360_backend' -Destination '.dfx-backup\onchain360_backend' -Recurse -Force
}
Write-Host "- Removing .dfx local state..." -ForegroundColor Gray
if (Test-Path '.dfx\local') {
    Remove-Item -Path '.dfx\local' -Recurse -Force
}
Write-Host

Write-Host "Step 3: Starting fresh dfx replica..." -ForegroundColor Yellow
if (Test-Path '.\dfx') {
    try {
        Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd '$PWD'; .\dfx start --clean" -WindowStyle Minimized
        Write-Host "- Started dfx in background" -ForegroundColor Green
    } catch {
        Write-Host "- Failed to start dfx: $_" -ForegroundColor Red
    }
}
Write-Host "- Waiting for replica to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 10
Write-Host

Write-Host "Step 4: Verifying dfx connectivity..." -ForegroundColor Yellow
$connected = $false
if (Test-Path '.\dfx') {
    try {
        $result = .\dfx ping
        if ($LASTEXITCODE -eq 0) {
            Write-Host "- Connection successful!" -ForegroundColor Green
            $connected = $true
        } else {
            Write-Host "- First connection attempt failed, retrying..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
            $result = .\dfx ping
            if ($LASTEXITCODE -eq 0) {
                Write-Host "- Connection successful on retry!" -ForegroundColor Green
                $connected = $true
            } else {
                Write-Host "ERROR: Could not connect to dfx replica!" -ForegroundColor Red
                Write-Host "Please ensure dfx is installed correctly." -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "ERROR: Failed to execute dfx ping: $_" -ForegroundColor Red
    }
}

if (-not $connected) {
    Write-Host
    Write-Host "===== Backend Connection Repair FAILED! =====" -ForegroundColor Red
    Write-Host
    Write-Host "Please try the following manual steps:" -ForegroundColor Yellow
    Write-Host "1. Close all terminal windows"
    Write-Host "2. Restart your computer"
    Write-Host "3. Open a new terminal and navigate to your project"
    Write-Host "4. Run: .\dfx start --clean"
    Write-Host "5. In another terminal run: .\dfx deploy --all"
    Write-Host
    Read-Host -Prompt "Press Enter to exit"
    exit 1
}
Write-Host

Write-Host "Step 5: Deploying backend canister..." -ForegroundColor Yellow
if (Test-Path '.\dfx') {
    try {
        Write-Host "- Installing onchain360_backend..." -ForegroundColor Gray
        .\dfx deploy onchain360_backend --mode=reinstall --yes
        if ($LASTEXITCODE -eq 0) {
            Write-Host "- Successfully deployed backend canister" -ForegroundColor Green
        } else {
            Write-Host "ERROR: Failed to deploy backend canister!" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "ERROR: Failed to deploy backend canister: $_" -ForegroundColor Red
        exit 1
    }
}
Write-Host

Write-Host "Step 6: Getting canister ID..." -ForegroundColor Yellow
$canisterId = $null
if (Test-Path '.\dfx') {
    try {
        $canisterId = .\dfx canister id onchain360_backend
        if ($LASTEXITCODE -eq 0 -and $canisterId) {
            Write-Host "- Canister ID: $canisterId" -ForegroundColor Green
        } else {
            Write-Host "ERROR: Failed to get canister ID!" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "ERROR: Failed to get canister ID: $_" -ForegroundColor Red
        exit 1
    }
}
Write-Host

Write-Host "Step 7: Generating TypeScript declarations..." -ForegroundColor Yellow
if (Test-Path '.\dfx') {
    try {
        .\dfx generate onchain360_backend
        if ($LASTEXITCODE -eq 0) {
            Write-Host "- Successfully generated TypeScript declarations" -ForegroundColor Green
        } else {
            Write-Host "ERROR: Failed to generate TypeScript declarations!" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "ERROR: Failed to generate TypeScript declarations: $_" -ForegroundColor Red
        exit 1
    }
}
Write-Host

Write-Host "Step 8: Creating environment file..." -ForegroundColor Yellow
if (Test-Path '.\dfx') {
    try {
        .\dfx generate --check
        Write-Host "- Environment files generated" -ForegroundColor Green
    } catch {
        Write-Host "WARNING: Failed to generate environment files: $_" -ForegroundColor Yellow
    }
}
Write-Host

Write-Host "Step 9: Checking canister status..." -ForegroundColor Yellow
if (Test-Path '.\dfx') {
    try {
        .\dfx canister status onchain360_backend
    } catch {
        Write-Host "WARNING: Failed to check canister status: $_" -ForegroundColor Yellow
    }
}
Write-Host

Write-Host "Step 10: Updating frontend environment..." -ForegroundColor Yellow
if ($canisterId) {
    try {
        Write-Host "- Creating .env.local file with proper canister ID..." -ForegroundColor Gray
        "VITE_CANISTER_ID=$canisterId" | Out-File -FilePath '.env.local' -Encoding ascii
        Write-Host "- Created .env.local with canister ID" -ForegroundColor Green
    } catch {
        Write-Host "WARNING: Failed to create .env.local: $_" -ForegroundColor Yellow
    }
}
Write-Host

Write-Host "===== Backend Connection Repair Completed! =====" -ForegroundColor Green
Write-Host
Write-Host "The backend should now be running correctly." -ForegroundColor Cyan
Write-Host "You can start the frontend with: npm run dev"
Write-Host
Write-Host "If you're still experiencing issues:" -ForegroundColor Yellow
Write-Host "1. Check browser console for specific error messages"
Write-Host "2. Verify the canister ID in src/services/actor.ts"
Write-Host "3. Make sure the frontend is using the correct port (4943)"
Write-Host

Read-Host -Prompt "Press Enter to continue" 