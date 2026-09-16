FROM node:21-alpine3.17

WORKDIR /opt/api

# json-server is pinned via package-lock.json and started as a module from
# server.js, which adds validation, JSON errors and a CORS allowlist on top.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY db.json server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
