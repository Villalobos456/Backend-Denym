# ══════════════════════════════════
# Backend Dockerfile
# Archivo: backend/Dockerfile
# ══════════════════════════════════
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start
CMD ["node", "server.js"]
