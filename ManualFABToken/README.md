# FAB
Manual FAB Token - ERC-20 Token (FAB)

On a fresh ubuntu 18.04 install:

    sudo apt-get update -y && apt install docker.io && systemctl start docker && systemctl enable docker

    git clone https://github.com/FABRK/FAB.git
    cd FAB

Create a new account by mnemonic using MyEtherWallet (offline): https://github.com/MyEtherWallet/MyEtherWallet/releases/download/v5.3.0/MyEtherWallet-v5.3.0.zip

Open a blank text file and paste in your mnemonic. Save this as .testnet_secret and again as .mainnet_secret

If you don't have any, get some rinkeby eth for your account at: https://faucet.rinkeby.io/

If you don't have any, get some eth for your account (0.02 should be enough).

## To run test suite locally
Start ganache
    docker run -d -p 8545:8545 trufflesuite/ganache-cli:latest
Open a new terminal, run
    docker build -t token ManualFABToken && docker run --network="host" -it token truffle migrate && truffle test

## To migrate to Rinkeby testnet
    docker build -t token ManualFABToken && docker run --network="host" -it token truffle migrate --network=rinkeby

## To migrate to Ethereum mainnet
    cd FAB
    docker build -t token ManualFABToken && docker run --network="host" -it token truffle migrate --network=mainnet
