# OnChain360 - Quick Start Guide

This guide will help you get OnChain360 up and running using Windows Subsystem for Linux (WSL).

## Prerequisites

- **Windows 10/11** with WSL enabled
- **Ubuntu** on WSL
- **Node.js** and **npm** installed on your Windows system
- **Internet Computer SDK (dfx)** installed in your WSL Ubuntu environment

## Step 1: Start the Backend

OnChain360 requires the Internet Computer SDK (dfx) running through WSL. Follow these steps:

1. Open Command Prompt or PowerShell
2. Navigate to the project directory:
   ```
   cd C:\Users\HP\Desktop\ONCHAIN360
   ```
3. Start dfx using the provided script:
   ```
   .\dfx-start.bat
   ```
   **Important:** Keep this terminal window open!

4. Open a second Command Prompt or PowerShell window
5. Navigate to the project directory again:
   ```
   cd C:\Users\HP\Desktop\ONCHAIN360
   ```
6. Deploy the backend canister:
   ```
   .\dfx-status.bat
   ```

When the deployment completes, you should see a message with your canister ID.

## Step 2: Start the Frontend

1. Open a third Command Prompt or PowerShell window
2. Navigate to the project directory again:
   ```
   cd C:\Users\HP\Desktop\ONCHAIN360
   ```
3. Install dependencies (if needed):
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and go to:
   ```
   http://localhost:5173
   ```

## Troubleshooting Backend Connection

If you encounter "Backend connection failed" errors:

1. Check if dfx is running in the first terminal window. You should see "Replica API running..." message.
2. Try redeploying the backend with:
   ```
   .\dfx-status.bat
   ```
3. If problems persist, try our automated fixer:
   ```
   .\fix-backend-wsl.bat
   ```

## WSL-Specific Requirements

This application requires dfx to run through WSL for several reasons:

1. The Internet Computer SDK has better compatibility with Linux environments
2. File permissions and networking are more reliable through WSL
3. The frontend communicates with the backend through a local HTTP endpoint (http://127.0.0.1:4943)

If you're experiencing persistent connection issues, make sure:

1. WSL is properly installed and Ubuntu is available
2. The dfx SDK is installed in your Ubuntu environment
3. Your firewall isn't blocking the connection between Windows and WSL

## Using Plug Wallet

OnChain360 uses Plug Wallet for authentication. To connect:

1. Install the [Plug Wallet](https://plugwallet.ooo/) browser extension
2. Click "Connect Wallet" in the app
3. Approve the connection in the Plug Wallet popup

## Project Structure

- `dfx-start.bat` - Starts dfx through WSL
- `dfx-status.bat` - Deploys and checks the status of the backend
- `fix-backend-wsl.bat` - Troubleshooting script for backend connection issues
- `src/` - Frontend React application code
- `src/onchain360_backend/` - Internet Computer backend canister code

## Development Flow

1. Start dfx through WSL (keep terminal open)
2. Deploy the backend canister 
3. Start the frontend development server
4. Make changes to your code
5. If you modify backend code, redeploy with `.\dfx-status.bat`

Remember to keep the dfx process running in the background while you're developing. 