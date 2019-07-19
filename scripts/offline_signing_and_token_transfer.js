const main = async () => {
    var Web3 = require('web3')
    const Tx = require('ethereumjs-tx')
    const fs = require('fs');

    var rawData = fs.readFileSync('build/contracts/FABToken.json')
    const ERC20_ABI_JSON = JSON.parse(rawData)
    const ERC20_ABI = ERC20_ABI_JSON['abi']

    rawData = fs.readFileSync('build/contracts/TokenTimelock.json')
    const TIMELOCK_ABI_JSON = JSON.parse(rawData)
    const TIMELOCK_ABI = TIMELOCK_ABI_JSON['abi']

    const TOTAL_SUPPLY = 55000000000

    /* BEGIN MODIFICATION SECTION
     */
    const PRIVATE_KEY = fs.readFileSync(".private_key").toString().trim() //Use the filename where you have stored your private Key 
    const PROVIDER = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/5716a30f3fe844f8a1726e8f67d79a5e"); //Use rinkeby for testnet and mainnet for mainnet
    var web3 = new Web3(PROVIDER) // Do not modify
    const OWNER_ADDRESS = '0x70432FE7B0D1130DA2e3c22Be4FB7F2ECc2883B3'.toLowerCase() // Owner of the initial supply, needs to match the private key in PRIVATE_KEY
    const TOKEN_CONTRACT_ADDRESS = '0xB688f7278004D6596a6Cb1a77F5aF602C8530521'.toLowerCase() // Address of the deployed ERC20 contract
    var erc20 = new web3.eth.Contract(ERC20_ABI, TOKEN_CONTRACT_ADDRESS, { from: OWNER_ADDRESS }) // Do not modify
    const TOKEN_TIMELOCK_ADDRESS = '0xE4080C67A25cFf75df4323ea5c5C01DDD5C22473'.toLowerCase() // Address of the deployed Token timelock contract - ORIG
    //const TOKEN_TIMELOCK_ADDRESS = '0x1e65F0Bb55203452D87aaFAe80AFd5B159a88C22'.toLowerCase() // Address of the deployed Token timelock contract
    const OWNER_BALANCE = (await erc20.methods.balanceOf(OWNER_ADDRESS).call()) // Do not modify
    const BALANCE_TO_TRANSFER = web3.utils.toWei((TOTAL_SUPPLY * 2 / 100).toString(), 'ether') // Number of tokens you wish to transfer to receiving address
    var timelock = new web3.eth.Contract(TIMELOCK_ABI, TOKEN_TIMELOCK_ADDRESS, { from: OWNER_ADDRESS }) // Do not modify
    const CHAIN_ID = 4 //4 for Rinkeby, 1 for Mainnet
    /* 
     * END MODIFICATION SECTION
     */

    const nonce = await web3.eth.getTransactionCount(OWNER_ADDRESS)

    console.log("Name:", await erc20.methods.name().call())
    console.log("Decimals:", (await erc20.methods.decimals().call()).toString())
    console.log("Total supply:", (await erc20.methods.totalSupply().call()).toString())
    console.log("Timelock contract balance before transfer:", (await erc20.methods.balanceOf(TOKEN_TIMELOCK_ADDRESS).call()).toString())
    console.log("Transfer amount:", BALANCE_TO_TRANSFER.toString())
    console.log("Deploying address balance:", OWNER_BALANCE.toString())

    // try {
    //console.log(await timelock.methods.release().call({ gas: 4500000, from: OWNER_ADDRESS}))
    // } catch (error) {
    //     console.log(error)
    // }

    var rawTransaction = {
        from: OWNER_ADDRESS,
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(20 * 1e9),
        gasLimit: web3.utils.toHex(210000),
        to: TOKEN_TIMELOCK_ADDRESS,
        value: 0,
        data: timelock.methods.release().encodeABI(),
        chainId: web3.utils.toHex(CHAIN_ID)
    }
  
    var privKey = new Buffer(PRIVATE_KEY, 'hex')
    var tx = new Tx(rawTransaction)
    tx.sign(privKey)
    const serializedTx = `0x${tx.serialize().toString('hex')}`

    web3.eth.sendSignedTransaction(serializedTx).on('receipt', console.log)
}

main()
