# Internet Computer Backend Connection Guide

This guide helps you set up and troubleshoot connections between your frontend and the Internet Computer backend canisters.

## Quick Start

1. Start the local dfx replica and deploy the backend:
   ```
   .\start-local-dev.bat
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

3. The application should now be running with proper backend connectivity.

## How Backend Connections Work

The OnChain360 application uses the Internet Computer's agent library to connect to backend canisters:

1. **Canister ID**: Each backend canister has a unique identifier (e.g., `rrkah-fqaaa-aaaaa-aaaaq-cai` for local development)
2. **Agent**: The HttpAgent connects to the replica (local or IC mainnet)
3. **Actor**: An actor is created for each canister to interact with backend functions

## Troubleshooting Common Issues

### "Backend connection failed" Error

If you see this error, check the following:

1. **Is dfx running?**
   ```
   dfx ping
   ```
   If not, start it with:
   ```
   dfx start --clean
   ```

2. **Is the backend canister deployed?**
   ```
   dfx canister status onchain360_backend
   ```
   If not, deploy it with:
   ```
   dfx deploy onchain360_backend
   ```

3. **Are the TypeScript declarations generated?**
   Check if files exist in `src/declarations/onchain360_backend/`
   If not, generate them with:
   ```
   dfx generate onchain360_backend
   ```

4. **Check the canister ID matches:**
   - The `CANISTER_ID` in `src/services/actor.ts` should match the local canister ID
   - Get your local ID with:
     ```
     dfx canister id onchain360_backend
     ```

### Network Configuration

- **Local Development**: Uses `http://127.0.0.1:4943`
- **Production**: Uses `https://ic0.app`

The application automatically detects local vs production environments based on the hostname.

## Frontend-Backend Integration

The frontend connects to the backend through several key files:

1. **actor.ts**: Creates actors to interact with the backend
2. **AuthContext.tsx**: Handles authentication with Plug Wallet
3. **BackendStatusIndicator.tsx**: Shows real-time backend connection status

## Best Practices for IC Development

1. Always start dfx before the frontend dev server
2. Use `dfx deploy --mode=reinstall` when making breaking changes to the backend
3. Regenerate TypeScript declarations when backend interfaces change
4. Check browser console for detailed connection error messages

## Using Plug Wallet with Local Development

1. Install the [Plug Wallet](https://plugwallet.ooo/) browser extension
2. When connecting, make sure the local canister ID is in the whitelist
3. The application automatically configures Plug for local or production use

## Connection Indicators

The application now shows the backend connection status in the bottom-right corner:
- 🟡 Yellow: Connecting to backend
- 🟢 Green: Connected successfully
- 🔴 Red: Connection error with troubleshooting options

## Manual Restart Process

If you need to manually restart everything:

1. Stop dfx and any running processes:
   ```
   dfx stop
   ```

2. Clear the .dfx directory (optional, for clean slate):
   ```
   rmdir /s /q .dfx
   ```

3. Start dfx and deploy canisters:
   ```
   dfx start --clean
   dfx deploy
   dfx generate
   ```

4. Start the frontend:
   ```
   npm run dev
   ``` 