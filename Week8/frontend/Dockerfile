FROM node:latest

WORKDIR /react-app

COPY public/ /react-app/public

COPY src/ /react-app/src

COPY package.json /react-app/

RUN npm install

EXPOSE 3000

#CMD ["/bin/bash"]
#CMD ["npm", "start"]