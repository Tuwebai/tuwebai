#!/bin/bash

# Clone the repository
git clone https://github.com/Juanchii-Dev/Webailauncher.git

# Move all files from the cloned repository to the root directory
mv Webailauncher/* .
mv Webailauncher/.* . 2>/dev/null || true

# Remove the now empty directory
rmdir Webailauncher

# Install dependencies
npm install

# Start the application
npm run dev
