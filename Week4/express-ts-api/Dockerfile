# Base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for TS compilation)
RUN npm install

# Copy the rest of the backend files
COPY . .

# Compile TypeScript to JS
#RUN npx tsc

# Expose backend port
EXPOSE 8080

# Run the compiled JS file
CMD ["npx", "ts-node", "server.ts"]
#CMD ["node", "dist/server.js"]
#CMD ["npm", "start"]
