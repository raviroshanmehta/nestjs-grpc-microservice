FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY tsconfig*.json ./
COPY src ./src
COPY proto ./proto
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production GRPC_URL=0.0.0.0:50051
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY proto ./proto
USER node
EXPOSE 50051
CMD ["node", "dist/main.js"]
