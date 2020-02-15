const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const csv = require('fast-csv');
var BigNumber = require('big-number');
const contract = require("@truffle/contract")

process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.message}`)
  throw new Error('Closing up shop on error.');
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled rejection at ', promise, `reason: ${reason}`)
  throw new Error('Closing up shop on rejection.');
})

// let FABDistributionAddress = '0x4eC7Dd9e86aa752B12Ba07B50220B8dD1Dfc2cf8'
let totalSpent = 0;
let FABDistributionAddress = process.argv.slice(2)[0];
let BATCH_SIZE = process.argv.slice(2)[1];
if(!BATCH_SIZE)
{
  BATCH_SIZE = 80;
}

var DistString = JSON.parse( fs.readFileSync( './scripts/FABDistribution.json', "utf8" ) )
var FabString = JSON.parse( fs.readFileSync( './scripts/FABToken.json', "utf8" ) )

let FABDistribution = contract(DistString);
let FABToken = contract(FabString);

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  const tnMnemonic = fs.readFileSync(".testnet_secret").toString().trim();
  console.log("Using Rinkeby Provider")
  var rinkebyProvider = new HDWalletProvider(tnMnemonic, "https://rinkeby.infura.io/v3/5716a30f3fe844f8a1726e8f67d79a5e");
  web3 = new Web3(rinkebyProvider);
  FABDistribution.setProvider(web3.currentProvider);
  FABToken.setProvider(web3.currentProvider);
}


let distribData = new Array();
let addresses = new Array();
let amountData = new Array();
let amounts = new Array();
let fullFileData = new Array();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function setAllocation() {

  console.log(`
    --------------------------------------------
    ---------Performing allocations ------------
    --------------------------------------------
  `);

  let accounts = await web3.eth.getAccounts();
  let userBalance = await web3.eth.getBalance(accounts[0]);

  let xFABDistribution = await FABDistribution.at(FABDistributionAddress);

  for(var i = 0;i< distribData.length;i++){

    try{
      let gPrice = 10000000000;

      console.log("Attempting to allocate FAB to accounts:",distribData[i],"\n");

      const transactionObject = {
        from: accounts[0],
        gas: 5500000,
        gasPrice: gPrice
      };

      let r = await xFABDistribution.airdropTokens(distribData[i], amountData[i], {from:accounts[0], gas:5500000, gasPrice: gPrice});

      console.log("---------- ---------- ---------- ----------");
      var spent = r.receipt.gasUsed * gPrice
      totalSpent += spent
      var spentString = web3.utils.fromWei( spent.toString() , 'ether' )
      console.log("Allocation + transfer was successful.", r.receipt.gasUsed, "gas used. Spent:",spentString,"eth");
      console.log("---------- ---------- ---------- ----------\n\n")
    } catch (err){
      console.log("ERROR:",err);
    }

  }
  console.log(`
    ---------------------------------------------------------
    ------------------- Airdrop Complete --------------------
    ---------------------------------------------------------
  `);
  var grandString = web3.utils.fromWei( totalSpent.toString() , 'ether' )
  console.log("Grand total spent:",grandString,"eth\n");
  process.exit(0)
}

function readFile() {
  var stream = fs.createReadStream("./scripts/airdrop.csv");

  let index = 0;
  let batch = 0;

  console.log(`
    ---------------------------------------------------------
    --------------- Parsing airdrop.csv file ----------------
    ---------------------------------------------------------
    * Removing beneficiaries without tokens or address data *
  `);
  console.log("ADDRESS                                    AMOUNT");
  const path = './scripts/airdrop.csv'

  try {
    if (fs.existsSync(path)) {
      const file = fs.readFileSync(path, 'utf8');
      console.log(file);
    }
  } catch(err) {
    console.error(err)
  }

  var csvStream = csv.parse();

  csvStream.on("data", function(data){
          let isAddress = web3.utils.isAddress(data[0]);
          if(isAddress && data[0]!=null && data[0]!='' ){
            addresses.push(data[0]);
            var amount = 0;
            if(data[1]!=null && data[1]!=''){amount=data[1]}
            amounts.push( web3.eth.abi.encodeParameter('uint256',amount) );
            index++;
            if(index >= BATCH_SIZE)
            {
              distribData.push(addresses);
              amountData.push(amounts);
              addresses = [];
              amounts = [];
              index = 0;
            }

          }
      }).on("end", function(){
           distribData.push(addresses);
           amountData.push(amounts);
           addresses = [];
           amounts = [];
           console.log("Finished parsing csv data");
           setAllocation();
      });

  stream.pipe(csvStream);
}

if(FABDistributionAddress){
  console.log("Processing airdrop. Batch size is",BATCH_SIZE, "accounts per transaction");
  readFile();
}else{
  console.log("Please run the script by providing the address of the FABDistribution contract");
  process.exit(0)
}
