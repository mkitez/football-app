# Create image based on the official Node 6 image from dockerhub
FROM node:6

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependecies
RUN npm config set proxy http://proxy-chain.intel.com:911
RUN npm config set https-proxy http://proxy-chain.intel.com:912
RUN npm config set strict-ssl false
RUN set HTTP_PROXY=http://proxy-chain.intel.com:911
RUN set HTTPS_PROXY=http://proxy-chain.intel.com:912
RUN npm --without-ssl --insecure install

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "run", "build"]