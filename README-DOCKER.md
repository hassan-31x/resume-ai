# Dockerized LaTeX Resume Renderer

This document provides instructions for running the LaTeX Resume Renderer application using Docker, which eliminates the need to install LaTeX locally.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd resume-ai
   ```

2. Build and start the Docker container:
   ```bash
   docker-compose up -d --build
   ```

   This command will:
   - Build the Docker image with Node.js and LaTeX installed
   - Install all the required dependencies
   - Start the application on port 3000

3. Access the application in your browser at:
   ```
   http://localhost:3000/demo-resume
   ```

   Or try the interactive editor at:
   ```
   http://localhost:3000/resume-renderer
   ```

## Stopping the Container

To stop the running Docker container:
```bash
docker-compose down
```

## Development Mode

If you want to run the application in development mode with hot-reloading:

1. Modify the docker-compose.yml file:
   ```yaml
   environment:
     - NODE_ENV=development
   command: npm run dev
   ```

2. Rebuild and restart the container:
   ```bash
   docker-compose up -d --build
   ```

## Verifying LaTeX Installation

To verify that LaTeX is correctly installed in the Docker container:

```bash
docker-compose exec app npm run check-latex
```

This will run the LaTeX dependency checker inside the Docker container.

## Troubleshooting

### PDF Doesn't Render

If the PDF doesn't render, check the Docker logs:
```bash
docker-compose logs app
```

Look for any LaTeX compilation errors in the logs.

### Adding Additional LaTeX Packages

If you need additional LaTeX packages, you can modify the Dockerfile:

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    # Add your additional packages here \
    && rm -rf /var/lib/apt/lists/*
```

Then rebuild the Docker image:
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Architecture

This Docker setup creates a container that includes:
- Node.js for running the Next.js application
- A complete LaTeX distribution with all necessary packages
- The application code mounted as a volume for easy development

The LaTeX renderer API uses the installed LaTeX distribution to compile documents and serve PDFs. 