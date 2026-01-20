#!/bin/bash

# SNAP SDK Docker Development Helper Script

set -e

COMPOSE_FILE="docker-compose.yml"
SERVICE_NAME="snap-sdk"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_usage() {
    echo "SNAP SDK Docker Development Helper"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       - Start the Docker container"
    echo "  stop        - Stop the Docker container"
    echo "  restart     - Restart the Docker container"
    echo "  shell       - Open a bash shell in the container"
    echo "  logs        - View container logs"
    echo "  build       - Rebuild the Docker image"
    echo "  clean       - Stop and remove containers and volumes"
    echo "  install     - Install npm dependencies in container"
    echo "  gulp        - Run gulp build in container"
    echo "  status      - Show container status"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh start"
    echo "  ./dev.sh shell"
    echo "  ./dev.sh install"
}

case "$1" in
    start)
        echo -e "${GREEN}Starting SNAP SDK container...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Container started. Use './dev.sh shell' to access it.${NC}"
        ;;
    stop)
        echo -e "${YELLOW}Stopping SNAP SDK container...${NC}"
        docker-compose down
        echo -e "${GREEN}Container stopped.${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Restarting SNAP SDK container...${NC}"
        docker-compose restart
        echo -e "${GREEN}Container restarted.${NC}"
        ;;
    shell)
        echo -e "${GREEN}Opening shell in SNAP SDK container...${NC}"
        docker-compose exec $SERVICE_NAME bash
        ;;
    logs)
        docker-compose logs -f $SERVICE_NAME
        ;;
    build)
        echo -e "${YELLOW}Rebuilding SNAP SDK Docker image...${NC}"
        docker-compose build --no-cache
        echo -e "${GREEN}Build complete. Use './dev.sh start' to run.${NC}"
        ;;
    clean)
        echo -e "${RED}Stopping and removing containers and volumes...${NC}"
        docker-compose down -v
        echo -e "${GREEN}Cleanup complete.${NC}"
        ;;
    install)
        echo -e "${GREEN}Installing npm dependencies...${NC}"
        docker-compose exec $SERVICE_NAME npm install
        echo -e "${GREEN}Dependencies installed.${NC}"
        ;;
    gulp)
        echo -e "${GREEN}Running gulp build...${NC}"
        docker-compose exec $SERVICE_NAME gulp build
        echo -e "${GREEN}Build complete.${NC}"
        ;;
    status)
        docker-compose ps
        ;;
    *)
        print_usage
        exit 1
        ;;
esac

