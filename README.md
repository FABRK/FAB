# FAB
ERC-20 Token (FAB)

Install:

    npm i -g truffle@5.0.20
    npm i -g ganache-cli@6.4.3

Steps to run on your local environment:

    Open terminal , run "ganache-cli"
    Open another terminal, cd <fab directory>
    npm i
    truffle compile
    truffle test

All test cases should pass

Steps to deploy to Rinkeby testnet or Mainnet starting with a stock Ubuntu 18.04 OS:

    download and install ubuntu 18.04 desktop version from the ubuntu.org website
    sudo apt update
    install chrome 
    install metamask and write down mnemonic seed words
    sudo apt install git 
    sudo apt install curl
    curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh -o install_nvm.sh
    bash install_nvm.sh
    nvm install 9.5.0
    npm i -g truffle@5.0.20 ganache-cli@6.4.3
    go to github.com/FABRK/FAB, click clone or download and choose download and extract the file
    cd to the FAB-master directory where it was extracted (usually home, desktop or downloads)
    npm i
    add your respective 12 word mnemonics into .testnet_secret and .mainnet_secret
    truffle compile
    sign up for an account on infura
    update truffle-config.js infura URLs with your mainnet and rinkeby URLs
    You will need to have some ETH in your mainnet address to deploy the contract
    To get testnet ETH totest on Rinkeby, please use faucet.rinkeby.io and request funds by following their instructions
    run truffle migrate --network=rinkeby to deploy the contract onto the test network
