# https://sreyaj.dev/deploy-nodejs-applications-on-a-vps-using-coolify-with-dockerfile
# Dockerfile for Next.js
FROM node:20-alpine

# https://stackoverflow.com/a/65443098/4034811
WORKDIR /app
# starts in repo root
COPY . /app

# Install dependencies
RUN npm install --legacy-peer-deps

# Build the Next.js application
RUN npm run build

# Start the Next.js application
CMD ["npm", "run", "coolify"]
