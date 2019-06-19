const FABToken = artifacts.require("FABToken")
const TokenTimelock = artifacts.require("TokenTimelock")

const ethGetBlock = web3.eth.getBlock

module.exports = function (deployer, networks, accounts) {
    // To deploy just erc20 token
    //deployer.deploy(FABToken, "FAB Token", "FAB", 18)

    // To deploy just time lock contract
    // return ethGetBlock('latest').then(function (block) {
    //     return deployer.deploy(TokenTimelock, '<erc 20 address>', accounts[0], block.timestamp + 30 *30 * 24 * 180)
    // })

    // To deploy both erc20 token and time lock contract
    deployer.deploy(FABToken, "FAB Token", "FAB", 18).then(function () {
        return ethGetBlock('latest').then(function (block) {
            return deployer.deploy(TokenTimelock, FABToken.address, accounts[0], block.timestamp + 30 * 30 * 24 * 180)
        })
    })
}
