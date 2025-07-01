#!/bin/bash

echo "Disabling frontend service since we're using static files..."

# Stop the service
sudo systemctl stop eveabacus-frontend

# Disable the service
sudo systemctl disable eveabacus-frontend

# Remove the service file
sudo rm /etc/systemd/system/eveabacus-frontend.service

# Reload systemd
sudo systemctl daemon-reload

echo "Frontend service disabled successfully!"
echo "Static files will be served by nginx from /var/www/html/" 