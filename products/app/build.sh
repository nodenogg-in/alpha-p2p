#!/bin/bash

# Install pnpm globally if not already installed
if ! command -v pnpm &> /dev/null
then
    echo "pnpm not found, installing..."
    npm install -g pnpm
fi

# Install project dependencies using pnpm
pnpm install

# Build the project (replace with your actual build command)
pnpm run build