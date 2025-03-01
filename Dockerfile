# Use Node.js 20.9.0 as base image
FROM node:20.9.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# **Build the project**
RUN npm run build

# Expose the port the API runs on
EXPOSE 4000

# Define environment variables (Optional: Move to .env)
ENV NODE_ENV=production

# **Run the compiled JS instead of TypeScript**
CMD ["node", "dist/server.js"]
