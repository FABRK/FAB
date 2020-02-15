const FABToken = artifacts.require("ManualToken")

module.exports = function (deployer, networks, accounts) {
    // To deploy just erc20 token
    deployer.deploy(FABToken)
    console.log(`
      ---------------------------------------------------------------
      ------- FAB (FAB) TOKEN CONTRACT SUCCESSFULLY DEPLOYED --------
      ---------------------------------------------------------------
    `);
    const fs = require('fs');
    const path_from = './build/contracts/ManualToken.json'
    const path_to = './shared/FABToken.json'

    try {
      if (fs.existsSync(path_from)) {
        //const contract = JSON.parse(fs.readFileSync(path, 'utf8'));
        //console.log(JSON.stringify(contract));
        // destination will be created or overwritten by default.
        fs.copyFile(path_from, path_to, (err) => {
          if (err) throw err;
          console.log(`
            ---------------------------------------------------------------
            ------- FAB (FAB) TOKEN ARTIFACTS SUCCESSFULLY COPIED ---------
            ---------------------------------------------------------------
          `);
        });
      }
    } catch(err) {
      console.error(err)
    }
}
