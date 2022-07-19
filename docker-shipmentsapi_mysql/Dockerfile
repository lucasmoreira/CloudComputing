# Specifies the base image we're extending
FROM node:12
# Specify the "working directory" for the rest of the Dockerfile
WORKDIR /src
# Install packages using NPM (bundled with the node:12 image)
COPY ./app/package.json /src/package.json
RUN npm install 
RUN npm install mysql
# Or list each module install here
# Add application code
COPY ./app/server.js /src/app/server.js
COPY ./app/api /src/app/api
# Set environment to "development" by default
ENV NODE_ENV development
# Run the application directly via node
CMD ["node", "/src/app/server.js","start"]
