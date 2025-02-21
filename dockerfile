# Build React & Nginx
FROM --platform=linux/amd64 node:20.5.1 AS build
# Create folder /ffreact in container
WORKDIR /ffreact
# Copy package.json to /ffreact folder in container
COPY ./ffreact/package.json ./
COPY ./ffreact/package-lock.json ./
RUN npm install -g dotenv-cli
# Install dependencies (ci uses package-lock.json instead of package.json should be faster )
RUN npm ci --legacy-peer-deps
# Copy all react files to the container
COPY ./ffreact ./

ARG BUILD_FOR=qa

# Build react files in the container
RUN npm run build-$BUILD_FOR

# Set up NGINX
FROM nginx:1.18.0-alpine
# Copy the default.conf and the react build files to their respective locations in container
COPY ./webserver/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /ffreact/build /usr/share/nginx/html