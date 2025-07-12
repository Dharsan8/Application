# Step 1: Use Node.js image
FROM node:18

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all backend source code
COPY . .

# Step 6: Expose the port your backend runs on (e.g., 3000)
EXPOSE 3000

# Step 7: Start the backend server
CMD ["node", "server.js"]
