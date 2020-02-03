FROM node:9.5
WORKDIR /usr/src/app
EXPOSE 8545
# Setup workspace environment
RUN apt-get update -y && apt-get install -y gcc
RUN chown -R node:node /usr/src
RUN chown -R node:node /usr/local
USER node
RUN npm install -g truffle@5.0.19
RUN npm install truffle-hdwallet-provider
RUN npm i
RUN npm install chai
RUN npm install chai-bignumber
COPY . .
CMD truffle compile
#CMD truffle compile && truffle migrate && truffle test
