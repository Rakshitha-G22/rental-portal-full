# Node.js base image
FROM node:20-alpine

# Set work directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy Angular app
COPY . .

# Build Angular app
RUN npm run build --prod

# Install a lightweight web server
RUN npm install -g serve

# Expose port 4200
EXPOSE 4200

# Serve the Angular build
CMD ["serve", "-s", "dist/user-app", "-l", "4200"]
