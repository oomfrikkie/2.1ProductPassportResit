FROM node:20

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY tsconfig.json ./
COPY src ./src

# Build the TS project
RUN npm run build

# Run compiled JS
CMD ["node", "dist/index.js"]
