#!/bin/bash

# Clone the repository
git clone https://github.com/Juanchii-Dev/tuwebaifinal.git

# Move all files from the cloned repository to the root directory
cp -r tuwebaifinal/* .
cp -a tuwebaifinal/.[^.]* . 2>/dev/null || true

# Remove the cloned directory
rm -rf tuwebaifinal

# Install dependencies
npm install

echo "Setup completed successfully!"
