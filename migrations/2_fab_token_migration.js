const FABToken = artifacts.require("FABToken")
const TokenTimelock = artifacts.require("TokenTimelock")

const ethGetBlock = web3.eth.getBlock

module.exports = function (deployer, networks, accounts) {
    deployer.deploy(FABToken, "FAB Token", "FAB", 18).then(function () {
        return ethGetBlock('latest')
    }).then(function (block) {
        return deployer.deploy(TokenTimelock, FABToken.address, accounts[0], block.timestamp + 30 *30 * 24 * 180)
    })
}