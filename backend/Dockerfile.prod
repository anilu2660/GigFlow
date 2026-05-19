# ---- Builder Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all deps (including devDeps like typescript)
RUN npm ci

COPY . .

# Build TypeScript — fail hard if compilation errors exist
RUN npm run build


# ---- Runtime Stage ----
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
# Cloud Run injects PORT=8080 at runtime; this is the fallback default
ENV PORT=8080
EXPOSE 8080

COPY package*.json ./

# Only production deps in final image
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]
