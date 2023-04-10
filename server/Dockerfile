# stage1 as builder
FROM node:16-alpine as builder

# copy the package.json to install dependencies
COPY . .

WORKDIR /server 

# Install the dependencies and make the folder
RUN npm install

# Build the project and copy the files
RUN npm run build

EXPOSE 8443

CMD [ "node", "./dist/index.js" ]