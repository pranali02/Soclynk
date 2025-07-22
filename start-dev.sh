#!/bin/bash
set -e

# OnChain360 Development Start Script
# This script will start the development environment

echo "🚀 Starting OnChain360 development environment..."

# Check if dfx is running
if ! dfx ping > /dev/null 2>&1; then
    echo "🔌 Starting dfx..."
    dfx start --background
    sleep 3
fi

# Check if backend is deployed
if ! dfx canister id onchain360_backend > /dev/null 2>&1; then
    echo "🏗️  Deploying backend canister..."
    dfx deploy onchain360_backend
fi

# Generate candid declarations
echo "🔧 Generating candid declarations..."
dfx generate onchain360_backend

# Start frontend development server
echo "🌐 Starting frontend development server..."
npm run dev