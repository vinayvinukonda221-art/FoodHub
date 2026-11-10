FROM node:18

WORKDIR /app

# Copy package manifests
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install all dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]
