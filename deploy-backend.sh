#!/bin/bash

# OnChain360 Backend Deployment Script
echo "🚀 Deploying OnChain360 Backend Canister..."

# Navigate to project directory
cd /mnt/c/Users/HP/Desktop/ONCHAIN360

# Source DFX environment
source ~/.local/share/dfx/env

# Check if DFX is running
if ! dfx ping local > /dev/null 2>&1; then
    echo "🔄 Starting DFX local network..."
    dfx start --background
    sleep 5
fi

# Clean build directory
echo "🧹 Cleaning build directory..."
rm -rf .dfx/local/canisters/onchain360_backend/
rm -rf target/

# Build and deploy backend
echo "🔨 Building and deploying backend canister..."
dfx canister create onchain360_backend --network local || echo "Canister already exists"
dfx build onchain360_backend --network local
dfx canister install onchain360_backend --network local --mode upgrade || dfx canister install onchain360_backend --network local --mode reinstall

# Get canister ID
CANISTER_ID=$(dfx canister id onchain360_backend --network local)
echo "✅ Backend canister deployed with ID: $CANISTER_ID"

# Generate declarations
echo "📋 Generating canister declarations..."
dfx generate onchain360_backend

echo "🎉 Backend deployment completed successfully!"
echo "Canister ID: $CANISTER_ID"
echo "Candid interface: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=$CANISTER_ID" 