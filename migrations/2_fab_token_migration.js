const FABToken = artifacts.require("FABToken")
const TokenTimelock = artifacts.require("TokenTimelock")

const ethGetBlock = web3.eth.getBlock

module.exports = function (deployer, networks, accounts) {
    // To deploy just erc20 token
    //deployer.deploy(FABToken, "FAB Token", "FAB", 18)

    // To deploy just time lock contract
    return ethGetBlock('latest').then(function (block) {
        return deployer.deploy(TokenTimelock, '0x12683dc9eec95a5f742d40206e73319e6b9d8a91', '0x7d2E9a870b992A4D7409d1fcD1B1c5B7b7dc836F', block.timestamp + 15552000)
    })

    // To deploy both erc20 token and time lock contract
    // deployer.deploy(FABToken, "FAB Token", "FAB", 18).then(function () {
    //     return ethGetBlock('latest').then(function (block) {
    //         return deployer.deploy(TokenTimelock, FABToken.address, accounts[0], block.timestamp + 30 * 30 * 24 * 180)
    //     })
    // })
}
