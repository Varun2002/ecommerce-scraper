FROM node
WORKDIR /server
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3500
CMD ["node", "server.js"]