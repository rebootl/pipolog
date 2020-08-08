FROM node:14-alpine

WORKDIR /usr/src/app

# install npm packages first to make use of caching
# server
COPY server/package*.json ./
RUN npm i
# client
RUN mkdir ./client
COPY server/client/package*.json ./client/
RUN cd client && npm i

# install and build client
COPY server/client/public ./client/public
COPY server/client/src ./client/src
COPY server/client/rollup.config.js ./client/
RUN cd client && npm run build

# install server
#COPY server/config.js ./config.js
COPY server/*.js ./
# for typescript
#COPY server/src ./src
#COPY server/tsconfig.json ./tsconfig.json
#RUN npm run build
#COPY db ./db
ENV NODE_ENV=production

EXPOSE 5051

CMD ["npm", "start"]
