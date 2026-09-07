FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 5173

# NOTE: Vite's dev server binds to "localhost" by default. Inside a
# container that makes it unreachable from the host even with the port
# published, so we explicitly bind to 0.0.0.0.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
