# Docker Development Environment for SNAP SDK

This directory contains Docker configuration files for running the SNAP SDK in an isolated development environment.

## Why Use Docker?

- **Isolated Environment**: Avoid conflicts with system-level Node.js and npm installations
- **Consistent Dependencies**: Ensure all developers use the same Node.js version (22.8.0)
- **Easy Setup**: No need to install Node.js, npm, or other dependencies on your host machine
- **Clean Updates**: Install and update dependencies without affecting your system

## Prerequisites

- Docker Desktop installed on your machine
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Build and Start the Container

From the `docker` directory:

```bash
cd docker
docker-compose up -d
```

This will:
- Build the Docker image with Node.js 22.8.0
- Start the container in detached mode
- Mount your project directory into the container
- Create a named volume for `node_modules`

### 2. Access the Container Shell

```bash
docker-compose exec snap-sdk bash
```

You're now inside the container with access to Node.js, npm, and all development tools.

### 3. Install Dependencies

Inside the container:

```bash
npm install
```

The dependencies will be installed in the Docker volume, not on your host machine.

### 4. Run Build Tasks

Inside the container:

```bash
# Run gulp build
gulp build

# Or use npm scripts
npm run <script-name>
```

### 5. Run the Example Server

Inside the container:

```bash
DEALER_URL=<dealer-url> PARTNER_ID=<your-partner-id> node example/example_server.js
```

The server will be accessible at `http://localhost:8081` on your host machine.

## Common Commands

### Start the Container
```bash
docker-compose up -d
```

### Stop the Container
```bash
docker-compose down
```

### Access Container Shell
```bash
docker-compose exec snap-sdk bash
```

### View Container Logs
```bash
docker-compose logs -f snap-sdk
```

### Rebuild the Container (after Dockerfile changes)
```bash
docker-compose build
docker-compose up -d
```

### Install/Update npm Packages
```bash
# Access the container
docker-compose exec snap-sdk bash

# Inside the container
npm install <package-name>
npm update
```

### Run Commands Without Entering the Container
```bash
docker-compose exec snap-sdk npm install
docker-compose exec snap-sdk gulp build
docker-compose exec snap-sdk node example/example_server.js
```

## Project Structure

```
docker/
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Docker Compose configuration
└── README.md           # This file
```

## How It Works

1. **Dockerfile**: Defines the container image with Node.js 22.8.0 and necessary build tools
2. **docker-compose.yml**: Orchestrates the container, volumes, and port mappings
3. **Volume Mounting**: 
   - Your project directory (`..`) is mounted to `/app` in the container
   - `node_modules` uses a named Docker volume to avoid conflicts with host OS

## Troubleshooting

### Port Already in Use
If port 8081 is already in use, edit `docker-compose.yml` and change the port mapping:
```yaml
ports:
  - "8082:8081"  # Use 8082 on host instead
```

### Permission Issues
If you encounter permission issues with files created in the container:
```bash
# Inside the container, match the user ID
docker-compose exec snap-sdk chown -R $(id -u):$(id -g) /app
```

### Clean Start
To completely reset the environment:
```bash
docker-compose down -v  # Remove volumes
docker-compose build --no-cache  # Rebuild image
docker-compose up -d
```

### Node Modules Not Found
If you get module not found errors:
```bash
docker-compose exec snap-sdk npm install
```

## Tips

- **Keep Container Running**: The container runs `tail -f /dev/null` by default to stay alive
- **Fast Rebuilds**: Changes to your code are immediately reflected (no rebuild needed)
- **Clean Environment**: Each `docker-compose down -v` gives you a fresh start
- **Multiple Terminals**: You can run `docker-compose exec snap-sdk bash` in multiple terminal windows

## Updating Node.js Version

To use a different Node.js version, edit `Dockerfile`:

```dockerfile
FROM node:20.10.0  # Change version here
```

Then rebuild:
```bash
docker-compose build --no-cache
docker-compose up -d
```

