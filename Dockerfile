FROM node:22-alpine
WORKDIR /app
COPY package.json server.mjs index.html shopify-demo.html ./
COPY src/ ./src/
COPY examples/ ./examples/
ENV HOST=0.0.0.0
ENV PORT=4173
EXPOSE 4173
USER node
CMD ["node", "server.mjs"]
