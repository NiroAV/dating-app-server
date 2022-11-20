# Inherit current image from an alpine image containing node (for latest versions use node:alpine):
FROM node:18-alpine3.15

# Install nodemon globally for hot-reloading using a Host Volume on project directory:
RUN npm i -g nodemon

# Install ts-node globally for running typescript:
RUN npm i -g ts-node

# Create an empty directory inside the container for project files and set it as the container's Current Directory:
WORKDIR /app

# Copy local package.json & package-lock.json into container's WORKDIR (last dot):
COPY package*.json .

# Install npm dependencies & devDependencies:
RUN npm i

# Copy project local files (first dot) into container's WORKDIR (last dot):
COPY . .
