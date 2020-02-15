var FABDistribution = artifacts.require('./FABDistribution.sol');

module.exports = async (deployer, network) => {
  let _now = Date.now();
  let _fromNow = 1 * 1000; // Start distribution in 1 second
  let _startTime = Math.round( ( _now + 1 ) / 1000 );
  await deployer.deploy(FABDistribution, '0xc904ebc86e924e3fe30eabc0e8faec0d92e623c4', _startTime);
  console.log(`
    ---------------------------------------------------------------
    --------- FAB (FAB) DISTRIBUTION CONTRACT SUCCESSFULLY DEPLOYED ---------
    ---------------------------------------------------------------
    - Contract address: ${FABDistribution.address}
    - Distribution starts in: ${_fromNow/1000/60} minutes
    - Local Time: ${new Date(_now + _fromNow)}
    ---------------------------------------------------------------
  `);
  const fs = require('fs');
  const path_from = './build/contracts/FABDistribution.json'
  const path_to = './shared/FABDistribution.json'

  try {
    if (fs.existsSync(path_from)) {
      fs.copyFile(path_from, path_to, (err) => {
        if (err) throw err;
        console.log(`
          ---------------------------------------------------------------
          ------- FAB DISTRIBUTION ARTIFACTS SUCCESSFULLY COPIED ---------
          ---------------------------------------------------------------
        `);
      });
    }
  } catch(err) {
    console.error(err)
  }
};
