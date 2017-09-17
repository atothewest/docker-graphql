FROM node:boron

# create app directory
ENV APP_DIR /usr/src/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

# install app dependencies
COPY package.json $APP_DIR
RUN npm install
