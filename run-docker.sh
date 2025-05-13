#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}==================================${NC}"
echo -e "${CYAN}LaTeX Resume Renderer - Docker CLI${NC}"
echo -e "${CYAN}==================================${NC}\n"

# Function to display help
function show_help {
  echo -e "Usage: ./run-docker.sh [command]"
  echo -e ""
  echo -e "Commands:"
  echo -e "  start       - Build and start the production container"
  echo -e "  start:dev   - Build and start the development container"
  echo -e "  stop        - Stop and remove containers"
  echo -e "  logs        - View logs from the container"
  echo -e "  check-latex - Run LaTeX dependency checker inside the container"
  echo -e "  help        - Show this help message"
  echo -e ""
  echo -e "Examples:"
  echo -e "  ./run-docker.sh start"
  echo -e "  ./run-docker.sh start:dev"
}

# Function to start production container
function start_prod {
  echo -e "${GREEN}Starting production container...${NC}"
  docker-compose up -d --build
  echo -e "${GREEN}Container started. Visit http://localhost:3000/demo-resume${NC}"
}

# Function to start development container
function start_dev {
  echo -e "${YELLOW}Starting development container...${NC}"
  docker-compose -f docker-compose.dev.yml up -d --build
  echo -e "${YELLOW}Dev container started with hot-reloading. Visit http://localhost:3000/demo-resume${NC}"
}

# Function to stop containers
function stop_containers {
  echo -e "${YELLOW}Stopping containers...${NC}"
  docker-compose down
  docker-compose -f docker-compose.dev.yml down
  echo -e "${GREEN}Containers stopped.${NC}"
}

# Function to view logs
function view_logs {
  echo -e "${CYAN}Viewing logs (press Ctrl+C to exit)...${NC}"
  docker-compose logs -f app
}

# Function to check LaTeX dependencies
function check_latex {
  echo -e "${CYAN}Checking LaTeX dependencies inside container...${NC}"
  docker-compose exec app npm run check-latex
}

# Process the command
case "$1" in
  start)
    start_prod
    ;;
  start:dev)
    start_dev
    ;;
  stop)
    stop_containers
    ;;
  logs)
    view_logs
    ;;
  check-latex)
    check_latex
    ;;
  help|*)
    show_help
    ;;
esac 