// Backend connectivity test script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===== Testing Backend Connectivity =====');

// Get backend directory from environment variable or use default
const backendDir = process.env.BACKEND_DIR || '/mnt/c/Users/HP/Desktop/ONCHAIN360';

// Get canister ID
let canisterId;
try {
  const output = execSync(`wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd ${backendDir} && dfx canister id onchain360_backend"`, { encoding: 'utf8' });
  canisterId = output.trim();
  console.log(`Found canister ID: ${canisterId}`);
} catch (error) {
  console.error('Failed to get canister ID:', error.message);
  process.exit(1);
}

// Check if declarations exist
const declarationsPath = path.join(__dirname, 'src', 'declarations', 'onchain360_backend');
try {
  if (fs.existsSync(declarationsPath)) {
    console.log(`Declarations directory exists: ${declarationsPath}`);
    
    // Check for required files
    const requiredFiles = ['index.d.ts', 'index.js', 'onchain360_backend.did', 'onchain360_backend.did.js'];
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(declarationsPath, file)));
    
    if (missingFiles.length === 0) {
      console.log('All required declaration files exist.');
    } else {
      console.error('Missing declaration files:', missingFiles);
      process.exit(1);
    }
  } else {
    console.error(`Declarations directory does not exist: ${declarationsPath}`);
    process.exit(1);
  }
} catch (error) {
  console.error('Error checking declarations directory:', error.message);
  process.exit(1);
}

// Create/update .env.local with the canister ID
try {
  fs.writeFileSync('.env.local', `VITE_CANISTER_ID=${canisterId}`);
  console.log('Created/updated .env.local with canister ID');
} catch (error) {
  console.error('Failed to create .env.local:', error.message);
  process.exit(1);
}

// Test dfx ping
try {
  const pingOutput = execSync(`wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd ${backendDir} && dfx ping"`, { encoding: 'utf8' });
  console.log('DFX ping successful:', pingOutput.trim());
} catch (error) {
  console.error('DFX ping failed:', error.message);
  process.exit(1);
}

// Test canister status
try {
  const statusOutput = execSync(`wsl -d Ubuntu -- bash -c "source ~/.local/share/dfx/env && cd ${backendDir} && dfx canister status onchain360_backend"`, { encoding: 'utf8' });
  console.log('Canister status:', statusOutput.trim());
} catch (error) {
  console.error('Failed to get canister status:', error.message);
  process.exit(1);
}

console.log('===== Backend Connectivity Test PASSED =====');
console.log('You can now start the frontend with: npm run dev');