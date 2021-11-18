const ASMBLE = artifacts.require("ASMBLE");

module.exports = function (deployer, networks, accounts) {
      // To deploy erc20 token
      deployer.deploy(ASMBLE, "SMBL", "SMBL");
}
