FROM node:latest
EXPOSE 8080
WORKDIR /code
COPY *.json .
COPY server.js .
COPY pages/* pages
RUN npm install
CMD ["/bin/bash"]