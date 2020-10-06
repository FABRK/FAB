FROM node:9.5
WORKDIR /usr/src/app
EXPOSE 8545
# Setup workspace environment
RUN apt-get update -y && apt-get install -y gcc
COPY . .
#RUN adduser -q node
RUN chown -R node:node /usr/src
RUN chown -R node:node /usr/src/app/scripts/token_freeze_feature.js
RUN chmod -x /usr/src/app/scripts/token_freeze_feature.js
RUN chown -R node:node /usr/local
RUN chmod 755 /usr/src/app/scripts/token_freeze_feature.js
USER node
RUN npm install -g truffle@5.0.19
RUN npm install truffle-hdwallet-provider
RUN npm i
RUN npm install chai
RUN npm install chai-bignumber

#RUN chmod -x /usr/src/app/scripts/token_freeze_feature.js
CMD truffle compile
#CMD truffle compile && truffle migrate && truffle test
