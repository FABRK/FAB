const FABToken = artifacts.require("ManualToken")

module.exports = function (deployer, networks, accounts) {
    // To deploy just erc20 token
    deployer.deploy(FABToken)
}
