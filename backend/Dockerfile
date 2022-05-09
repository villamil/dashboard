FROM node:17.1.0
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production
RUN npm install -g pkg

COPY . .
EXPOSE 4000
CMD [ "node", "src/index.js" ]