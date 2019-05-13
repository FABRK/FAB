const BigNumber = web3.BigNumber;

const FABToken = artifacts.require('FABToken');
const fs = require('fs');
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('FABToken', async(accounts) => {

    const _name = 'Fab Token';
    const _symbol = 'FAB';
    const _decimals = 18;
    const _totalSupply = 55000000000;

    const testRecords = 999;
    const owner = accounts[0];
    const fabCustomer1 = accounts[1];
    const fabCustomer2 = accounts[2];

    beforeEach(async function () {});

    describe('token attributes', async function () {
        it('Deploy', async function () {
            this.token = await FABToken.new(_name, _symbol, _decimals);
        });

        it('Register 999 addresses', async function () {
            if (fs.existsSync(`${process.env.PWD}/test-output/register.txt`)) {
                fs.unlinkSync(`${process.env.PWD}/test-output/register.txt`);
            }
            for (let i = 1; i <= testRecords; i++) {
                await this
                    .token
                    .register("FABADDRESS" + i, {from: accounts[i]});
                fs.appendFileSync(`${process.env.PWD}/test-output/register.txt`, "FABADDRESS" + i + "    " + accounts[i] + "\n");
            }
        });

        it('Retrive 1 million', async function () {

            if (fs.existsSync(`${process.env.PWD}/test-output/retrive.txt`)) {
                fs.unlinkSync(`${process.env.PWD}/test-output/retrive.txt`);
            }
            for (let i = 0; i < testRecords; i++) {
                let x = await this
                    .token
                    .keys(accounts[i])

                fs.appendFileSync(`${process.env.PWD}/test-output/retrive.txt`, x + "    " + accounts[i] + "\n");
            }
        });
    });
});
