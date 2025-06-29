# Systemd Service Files

This repository contains systemd service files for the EVE Abacus application components. These files are used to manage the backend and frontend services on the production server.

## Service Files

### `eveabacus-backend.service`
- **Service Name**: `eveabacus`
- **Description**: EVE Abacus Backend API
- **Working Directory**: `/var/www/eveabacus`
- **Executable**: `/usr/bin/dotnet EVEAbacus.WebUI.dll`
- **User**: `eveabacus`
- **Port**: `5000`
- **Environment**: Production

### `eveabacus-frontend.service`
- **Service Name**: `eveabacusfrontend`
- **Description**: EVE Abacus Next.js Frontend
- **Working Directory**: `/var/www/eveabacus/frontend`
- **Executable**: `/usr/local/lib/node_modules/pnpm/bin/pnpm.cjs start`
- **User**: `www-data`
- **Port**: `3000`
- **Environment**: Production

## Deployment Process

1. **Build Phase**: Service files are copied into the build artifacts
2. **Deployment Phase**: Service files are transferred to the VM and installed
3. **Service Management**: systemd daemon is reloaded and services are started

## Benefits of This Approach

- **Version Control**: Service files are tracked in git
- **Consistency**: Same configuration across all deployments
- **Easier Debugging**: Files can be tested and validated locally
- **No Escaping Issues**: No complex shell escaping in CI/CD
- **Maintainability**: Changes are visible in PRs and code reviews

## Manual Service Management

To manually manage services on the production server:

```bash
# Check service status
sudo systemctl status eveabacus
sudo systemctl status eveabacusfrontend

# Start services
sudo systemctl start eveabacus
sudo systemctl start eveabacusfrontend

# Stop services
sudo systemctl stop eveabacus
sudo systemctl stop eveabacusfrontend

# Restart services
sudo systemctl restart eveabacus
sudo systemctl restart eveabacusfrontend

# View logs
sudo journalctl -u eveabacus -f
sudo journalctl -u eveabacusfrontend -f
```

## Troubleshooting

If services fail to start:

1. Check the service file syntax: `sudo systemctl cat eveabacusfrontend`
2. View detailed logs: `sudo journalctl -u eveabacusfrontend -n 50`
3. Check file permissions: `ls -la /etc/systemd/system/eveabacusfrontend.service`
4. Verify working directory exists: `ls -la /var/www/eveabacus/frontend/` 