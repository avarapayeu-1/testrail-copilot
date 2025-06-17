FROM mcr.microsoft.com/playwright:latest

WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

# Set environment variables (you can override these when running the container)
ENV CI=true
ENV NODE_ENV=test
ENV HEADLESS=true
ENV TIMEOUT=60000

# Load environment variables from .env file if it exists (will be overridden by any passed in during docker run)
# This provides fallback values for when environment variables aren't explicitly passed

# Set up directories and permissions for pwuser (which already exists in the Playwright base image)
RUN mkdir -p /home/pwuser/Downloads \
    && chown -R pwuser:pwuser /home/pwuser \
    && chown -R pwuser:pwuser /app

# Switch to non-root user
USER pwuser

# Command to run API tests by default
CMD ["npm", "run", "test:api"]
