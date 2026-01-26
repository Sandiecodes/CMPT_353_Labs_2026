FROM node:latest
EXPOSE 8080
WORKDIR /code
COPY *.json .
RUN npm install
COPY . .
CMD ["/bin/bash"]

