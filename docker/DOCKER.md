# Docker Development Environment

This project includes a Docker-based development environment to avoid conflicts with system-level Node.js and npm installations.

## Quick Start

```bash
# Navigate to docker directory
cd docker

# Start the container
./dev.sh start

# Access the container shell
./dev.sh shell

# Inside the container, install dependencies
npm install

# Run gulp build
gulp build

# Run the example server
DEALER_URL=<dealer-url> PARTNER_ID=<your-partner-id> node example/example_server.js
```

## Full Documentation

See [docker/README.md](docker/README.md) for complete documentation on:
- How to use the Docker environment
- Common commands and workflows
- Troubleshooting tips
- Configuration options

## Benefits

- ✅ Isolated Node.js 22.8.0 environment
- ✅ No conflicts with system npm/node
- ✅ Consistent development environment across machines
- ✅ Easy dependency management
- ✅ Clean updates and rebuilds

