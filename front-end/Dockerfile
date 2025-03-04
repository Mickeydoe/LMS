# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json ./
RUN npm install --legacy-peer-deps --frozen-lockfile

# Copy all source code
COPY . .

# Set environment variables explicitly
ARG SECRET_COOKIE_PASSWORD
ENV SECRET_COOKIE_PASSWORD=${SECRET_COOKIE_PASSWORD}

# Run the build command
RUN npm run build

# Production Stage
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set environment variables
ENV SECRET_COOKIE_PASSWORD=${SECRET_COOKIE_PASSWORD}
ENV PORT=3000

# Expose the correct port
EXPOSE 3000

# Start Next.js correctly
CMD ["npm", "run", "start"]
