# Step 1: Build the React + Vite App
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy the production build from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config to handle client-side routing
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
