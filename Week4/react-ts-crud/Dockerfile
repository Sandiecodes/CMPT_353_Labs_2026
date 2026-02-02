FROM node:22

WORKDIR /react-app

COPY package.json package-lock.json* ./
RUN npm install

COPY public/ /react-app/public

COPY src/ /react-app/src

COPY . .

# Expose Vite port
EXPOSE 5173

# Run dev server accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
