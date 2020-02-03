FROM node:8.5
WORKDIR /usr/src/app
EXPOSE 8545
# Setup workspace environment
RUN apt-get update -y && apt-get install -y gcc
RUN npm i
COPY . .
