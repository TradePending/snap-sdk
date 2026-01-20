FROM node:22.8.0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm i -g gulp-cli@latest

# Set PATH to include local node_modules
ENV PATH="/app/node_modules/.bin:$PATH"

# Set working directory
WORKDIR /app

# Default command - keep container running
CMD ["tail", "-f", "/dev/null"]

