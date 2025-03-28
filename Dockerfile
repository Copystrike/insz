# ---- Build Stage ----
# Use the official Bun image as a builder
FROM oven/bun:1 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lock ./

# Install all dependencies (including devDependencies needed for build)
# Use --frozen-lockfile for reproducible installs
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Set NODE_ENV to production for the build process if needed by any plugins/logic
# ENV NODE_ENV=production

# Run the build script defined in package.json
# This will execute: bunx --bun vite build --mode client && bunx --bun vite build --mode server
RUN bun run build

# ---- Runtime Stage ----
# Use a slim Bun image for the final runtime environment
FROM oven/bun:1-slim AS runtime

# Set the working directory
WORKDIR /app

# Set NODE_ENV to production for runtime
ENV NODE_ENV=production
# You might want to expose PORT as an ENV variable if your app reads it
# ENV PORT=3000

# Copy package.json and bun.lockb from the builder stage
COPY --from=builder /app/package.json /app/bun.lock ./

# Install *only* production dependencies
RUN bun install --production --frozen-lockfile

# Copy the built server code from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the built client assets (public directory) from the builder stage
# Vite builds client assets into ./public based on your config
COPY --from=builder /app/public ./public

# (Optional but recommended) Run as a non-root user
# The official bun images come with a 'bun' user (UID 1000, GID 1000)
# Ensure the app directory is owned by the 'bun' user for permissions
# USER bun
# RUN chown -R bun:bun /app # Might not be needed if COPY respects USER, but good practice

# Expose the port the application will run on (defined as 3000 in vite.config.ts server block)
EXPOSE 3000

# Define the command to run the application using the start script
# This executes: bun run ./dist/index.js
CMD ["bun", "run", "./dist/index.js"]