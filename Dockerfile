# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json /app/

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the Docker image
COPY . /app/

# This command will run your application
CMD [ "npm", "test" ]


#port to listen after run
EXPOSE 8080
