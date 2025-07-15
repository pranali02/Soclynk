#!/bin/bash

# OnChain360 Deployment Script
# This script will deploy the OnChain360 project to the Internet Computer

echo "🚀 Starting OnChain360 deployment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install the Internet Computer SDK first."
    echo "📖 Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "📖 Visit: https://nodejs.org/"
    exit 1
fi

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust first."
    echo "📖 Visit: https://rustup.rs/"
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
if ! npm install; then
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

# Install Rust WASM target
echo "🦀 Installing Rust WASM target..."
if ! rustup target add wasm32-unknown-unknown; then
    echo "❌ Failed to install Rust WASM target"
    exit 1
fi

# Start dfx if not running
echo "🔌 Starting dfx..."
if ! dfx ping; then
    echo "Starting dfx in background..."
    dfx start --background
    sleep 5
fi

# Deploy backend canister
echo "🏗️  Deploying backend canister..."
if ! dfx deploy onchain360_backend; then
    echo "❌ Failed to deploy backend canister"
    exit 1
fi

# Generate candid declarations
echo "🔧 Generating candid declarations..."
if ! dfx generate onchain360_backend; then
    echo "❌ Failed to generate candid declarations"
    exit 1
fi

# Build frontend
echo "🌐 Building frontend..."
if ! npm run build; then
    echo "❌ Failed to build frontend"
    exit 1
fi

# Deploy frontend canister
echo "🚀 Deploying frontend canister..."
if ! dfx deploy onchain360_frontend; then
    echo "❌ Failed to deploy frontend canister"
    exit 1
fi

# Get canister URLs
echo "✅ Deployment successful!"
echo ""
echo "🌐 OnChain360 is now deployed!"
echo ""
echo "📱 Frontend URL: http://$(dfx canister id onchain360_frontend).localhost:4943"
echo "🔗 Backend Canister ID: $(dfx canister id onchain360_backend)"
echo ""
echo "🎉 Your decentralized social network is ready!"
echo "💡 Don't forget to install Plug Wallet to connect: https://plugwallet.ooo/"
echo ""
echo "📚 For development, run: npm run dev"
echo "🛠️  For local testing, visit: http://localhost:5173" 