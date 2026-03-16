# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci)
RUN npm install --production=false

# Copy source code
COPY . .

# Expose port (not really needed for worker, but good practice)
EXPOSE 3000

# Start the bot
CMD ["npm", "run", "start:simple"]
