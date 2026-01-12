FROM node:latest
# Create app directory
WORKDIR /app
# Install app dependencies
# Copy app files
COPY *.json ./
COPY server.js .
RUN npm install
#Expose port
EXPOSE 3002
#Start the app
#CMD [ "node", "server.js" ]
#Use terminal to start app
CMD ["/bin/bash"]