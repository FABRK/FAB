# FAB
ERC-20 Token (FAB)

Steps to deploy to Rinkeby testnet or Mainnet starting with a stock Ubuntu 18.04 OS:
    
    In terminal:
    sudo apt update

    install chrome from google.com/chrome
    install metamask from chrome extension store and follow the instructions
    copy the seed words to a txt file in the text editor, save to desktop, keep open 
    transfer some ETH into your new account (either the mainnet or rinkeby, or both, there's a dropdown in the upper left)

    In terminal:
    sudo apt install build-essential
    sudo apt install python
    sudo apt install git 
    sudo apt install curl 
    curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh -o install_nvm.sh 
    bash install_nvm.sh 

    Start new terminal instance, close the existing one
    nvm install 9.5.0 
    npm install -g truffle@5.0.20

    go to github.com/FABRK/FAB, click to download zip, unzip

    cd to the unzipped FAB directory
    npm i

    add your metamask 12 word seed phrase into the text editor and save as a file with no suffix called .testnet_secret and then another called .mainnet_secret in the top level of FAB (don't forget the period in front of the filename)

    In terminal:
    
    truffle compile

    You will need to have some ETH in your mainnet address to deploy the contract

    In terminal:
    truffle migrate --network=rinkeby (will create tokens on ethereum testnet called rinkeby)

    truffle migrate --network=mainnet (will create the tokens on the live mainnet)
    
    write down the Token contract address, Timelock contract address, Migration contract address and the address of the deployer.

Steps to deploy just timelock contract:

    Open migrations/fab_token_migration.js
    There should be 3 sections, one to deploy both the ERC20 token and the Timelock contract, one to deploy just the ERC20 
    and the last one to deploy just the Timelock contract.
    Uncomment the section for just the timelock contract (fill in the ERC20 token address where it says <erc 20 address>)

    In terminal: 

    truffle compile
    truffle deploy --network=rinkeby

    This will deploy just the timelock contract. Write down the Address.

Steps to test offline signing and token transfer to the timelock contract.

    Copy and paste your private key into .private_key in the main folder
    Open scripts/offline_signing_and_token_transfer.js
    Update the lines in the MODIFICATION_SECTION with the right information

    Transfer txn is commented out. So first try a dry run and confirm the information printed out to the screen is correct

    In terminal:

    node scripts/offline_signing_anda_token_transfer.js 

    If everything looks good, uncomment line 53 (web3.eth.sendSigned....)

    In terminal:

    node/scripts/offline_signing_and_token_transfer.js

    This will transfer the token amount you specified to the timelock contract address. Comment this line out.

    If you wish to verify that the balances were updated, you can run the same script again and it will give you the new balances. Please make sure that the sendSignedTransaction line is commented out here.
