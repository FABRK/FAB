const fs = require("fs");
var Web3 = require("web3");
const { EthHdWallet } = require("eth-hd-wallet");
const Tx = require("ethereumjs-tx");
const { program } = require("commander");
const delay = require("delay");

/**
 * Variables used in the script
 * Modify these variables as required
 */
const FILE_NAME = "addresses.txt";
const OWNER_ADDRESS = "0x3a3aBdf35C333e6AB31F8cd97491c12c5D3F0aeb".toLowerCase();
const TOKEN_CONTRACT_ADDRESS = "0xa5b0A9136edAB8Ed04dBE1918C72034B18ba94Af".toLowerCase();
const MNEMONIC_WORDS_FILE = ".testnet_secret";

/**
 * Local ganache provider
 *
 * REPLACE THIS with mainnet provider
 */
// const PROVIDER = new Web3.providers.HttpProvider("http://localhost:7545");
const PROVIDER = new Web3.providers.HttpProvider(
  "https://goerli.infura.io/v3/5716a30f3fe844f8a1726e8f67d79a5e"
);
const CHAIN_ID = 5;

/**
 * HD wallet used to test token sending functionality of the addresses
 *
 * The wallet is ALSO used get the privateKey to sign the
 * freeze transaction using mnemonic
 *
 * generateAddresses function is invoked to initialize the wallet
 * using 6 addresses here
 * 1 as contract Owner
 * rest 5 as sample addresses to send and receive tokens
 */
const wallet = EthHdWallet.fromMnemonic(
  fs.readFileSync(MNEMONIC_WORDS_FILE).toString()
);
wallet.generateAddresses(6);

/**
 * Read built contract ABI
 */
var rawData = fs.readFileSync("build/contracts/ManualToken.json");
const ERC20_ABI_JSON = JSON.parse(rawData);
const ERC20_ABI = ERC20_ABI_JSON["abi"];

/**
 * Initialize the contract
 */
var web3 = new Web3(PROVIDER); // Do not modify
var erc20 = new web3.eth.Contract(ERC20_ABI, TOKEN_CONTRACT_ADDRESS, {
  from: OWNER_ADDRESS,
});

/**
 * function to read the txt file with addresses and amount
 *
 * 0x9d031299A1EB6E434e12671667Ea4f247E4c487B 1000
 * 0x9d031299A1EB6E434e12671667Ea4f247E4c487B 2000
 * 0x9d031299A1EB6E434e12671667Ea4f247E4c487B 3000
 *
 * more ..
 */
const getAddresses = async function () {
  const lines = fs.readFileSync(FILE_NAME).toString().split("\n");
  const addresses = [];
  for (const line of lines) {
    const [address, amount] = line.split(" ");
    const obj = {
      address: address.toLowerCase(),
      amount: Number(amount),
    };
    addresses.push(obj);
  }
  return addresses;
};

const getBalance = async function (address) {
  const balance = await erc20.methods.balanceOf(address).call();
  return balance;
};

const submitTransferTransaction = async function (from, To, tokenAmount) {
  const nonce = await web3.eth.getTransactionCount(from);
  console.log("\nGot tx count of owner address\n");
  var rawTransaction = {
    from: from,
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(60 * 1e9),
    gasLimit: web3.utils.toHex(210000),
    to: TOKEN_CONTRACT_ADDRESS,
    value: 0,
    data: erc20.methods
      .transfer(To, web3.utils.toWei(`${tokenAmount}`))
      .encodeABI(),
    chainId: web3.utils.toHex(CHAIN_ID),
  };

  const privateKey = wallet.getPrivateKey(from);

  var tx = new Tx(rawTransaction);
  tx.sign(privateKey);
  const serializedTx = `0x${tx.serialize().toString("hex")}`;

  await web3.eth.sendSignedTransaction(serializedTx);
};

const submitFreezeTransaction = async function (address, tokenAmount) {
  const nonce = await web3.eth.getTransactionCount(OWNER_ADDRESS);
  console.log("\nGot tx count of owner address\n");
  var rawTransaction = {
    from: OWNER_ADDRESS,
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(60 * 1e9),
    gasLimit: web3.utils.toHex(210000),
    to: TOKEN_CONTRACT_ADDRESS,
    value: 0,
    data: erc20.methods
      .freezeAmount(address, web3.utils.toWei(`${tokenAmount}`))
      .encodeABI(),
    chainId: web3.utils.toHex(CHAIN_ID),
  };
  console.log("\nCreated raw tx object\n");
  const privateKey = wallet.getPrivateKey(OWNER_ADDRESS);

  var tx = new Tx(rawTransaction);
  tx.sign(privateKey);
  console.log("\nSigned raw tx object\n");
  const serializedTx = `0x${tx.serialize().toString("hex")}`;
  console.log("\nawaiting sendSignedTransaction\n");
  await web3.eth.sendSignedTransaction(serializedTx);
};

const setup = async function () {
  // console.log("\nsending tokens to addresses from the file\n");
  const addresses = await getAddresses();

  for (const addr of addresses) {
    await submitTransferTransaction(OWNER_ADDRESS, addr.address, addr.amount);
    console.log("Transferred", addr.address, addr.amount);
  }
  await delay(2000);
  console.log("\nToken transfer complete!\n");
  console.log("\nVerifying the balance of the transferred addresses\n");
  for (const addr of addresses) {
    console.log(addr.address);
    console.log("Expected: ", addr.amount);
    const balance = await getBalance(addr.address);
    console.log("Balance : ", balance / 1e18);
    if (addr.amount === balance / 1e18) {
      console.log("**** Passed ✓ ****");
    } else {
      console.log("**** Failed ✕ ****");
    }
    console.log("\n");
  }
  await delay(2000);
  console.log(
    "\nTransferring 10% balance back to the owner to test the receive and send functionality before freeze\n"
  );
  for (const addr of addresses) {
    await submitTransferTransaction(
      addr.address,
      OWNER_ADDRESS,
      addr.amount * 0.1
    );
    console.log("Transferred from", addr.address, addr.amount * 0.1);
  }
  await delay(2000);
  console.log("\nTransfer from address to owner complete!\n");
  console.log("\nVerifying the reduced balance of the transferred addresses\n");
  for (const addr of addresses) {
    console.log(addr.address);
    console.log("Expected: ", addr.amount - addr.amount * 0.1);
    const balance = await getBalance(addr.address);
    console.log("Balance : ", balance / 1e18);
    if (addr.amount - addr.amount * 0.1 === balance / 1e18) {
      console.log("**** Passed ✓ ****");
    } else {
      console.log("**** Failed ✕ ****");
    }
    console.log("\n");
  }
  console.log(
    "\nSending the tokens back to address to maintain the balance as per the input file in testnet\n"
  );
  for (const addr of addresses) {
    await submitTransferTransaction(
      OWNER_ADDRESS,
      addr.address,
      addr.amount * 0.1
    );
    console.log("Transferred", addr.address, addr.amount * 0.1);
  }
  console.log("\n** Balance refill complete - verifying **\n");
  await delay(2000);

  for (const addr of addresses) {
    console.log(addr.address);
    console.log("Expected: ", addr.amount);
    const balance = await getBalance(addr.address);
    console.log("Balance : ", balance / 1e18);
    if (addr.amount === balance / 1e18) {
      console.log("**** Passed ✓ ****");
    } else {
      console.log("**** Failed ✕ ****");
    }
    console.log("\n");
  }
  console.log(
    "Setup Phase Complete!, please verify the cases above before the next phase execution"
  );
};

const freeze = async function () {
  console.log("\nFreezing the addresses and amount as per the file\n");
  const addresses = await getAddresses();
  for (const addr of addresses) {
    console.log("\nGot addresses, awaiting submitFreezeTransaction\n");
    await submitFreezeTransaction(addr.address, addr.amount);
    console.log("Freezed ", addr.address, addr.amount);
  }
  console.log("\n Addresses freeze is complete");
};

const testFreeze = async function () {
  console.log(
    "\nTesting freezed addresses, trying to send tokens to the owner...\n"
  );
  const addresses = await getAddresses();
  for (const addr of addresses) {
    const balance = await getBalance(addr.address);
    try {
      await submitTransferTransaction(
        addr.address,
        OWNER_ADDRESS,
        balance / 1e18
      );
      console.log("Tokens spent on address ", addr.address);
      console.log("Something is wrong, stop! stop! stop!");
    } catch (error) {
      console.log("Unable to spend tokens on address FREEZED", addr.address);
      console.log("**** Passed ✓ ****\n");
    }
  }
};

program
  .option("-s, --setup", "setup and execute test cases to verify the script")
  .option("-f, --freeze", "execute freeze on addresses")
  .option("-t, --test-freeze", "execute test on freezed addresses");

program.parse(process.argv);

if (program.setup) {
  setup();
} else if (program.freeze) {
  freeze();
} else if (program.testFreeze) {
  testFreeze();
} else {
  console.log("run script with option -h for help");
}
