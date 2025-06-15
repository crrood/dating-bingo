# syntax=docker/dockerfile:1

FROM node:24.2-slim
WORKDIR /webapp-client
COPY . .
RUN npm install
CMD ["npm", "run", "dev", "--", "--host"]
