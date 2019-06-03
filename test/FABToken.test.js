const { increaseTime, expectThrow, latestTime } = require('./util');

const BigNumber = web3.BigNumber;
const FABToken = artifacts.require('FABToken');
const FABTokenTimelock = artifacts.require('TokenTimelock.sol')

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('FABToken', async (accounts) => {
    const _name = 'Fab Token';
    const _symbol = 'FAB';
    const _decimals = 18;
    const _totalSupply = 55000000000;

    const owner = accounts[0];
    const fabCustomer1 = accounts[1];
    const fabCustomer2 = accounts[2];
    const exchangeAddress = accounts[4];

    beforeEach(async function () {
    });

    describe('token attributes', async function () {
        it('Deploy', async function () {
            this.token = await FABToken.new(_name, _symbol, _decimals);
            let timeLock = (await latestTime()) + 30
            this.timelock_contract = await FABTokenTimelock.new(this.token.address, owner, timeLock)
        });

        it('Transfer 20% to exchange', async function () {
            await this.token.transfer(exchangeAddress, _totalSupply * 20 / 100);
        });
        

        it('Total Supply is 55 billion', async function () {
            const totalSupply = await this.token.totalSupply();
            totalSupply.toString().should.equal(`${_totalSupply}`);
        });

        it('Owner has 80% of 55 billion balance , i.e total supply', async function () {
            const balanceOfOwner = await this.token.balanceOf(owner);
            balanceOfOwner.toString().should.equal(`${_totalSupply * 80 / 100}`);
        });

        it('Owner locks up all his coins in the Timelock contract, his balance should be 0, timelock contract should own 80% of coins', async function () {
            let balanceOfOwner = await this.token.balanceOf(owner);
            await this.token.transfer(this.timelock_contract.address, balanceOfOwner);
            balanceOfOwner = await this.token.balanceOf(owner);
            balanceOfOwner.toString().should.equal('0');
            let lockedBalance = await this.token.balanceOf(this.timelock_contract.address);
            lockedBalance.toString().should.equal(`${_totalSupply * 80 / 100}`);
        });

        it('Owner tries to release coins and it fails, since its before releaseTime', async function () {
            await expectThrow(this.timelock_contract.release())
        });

        it('Owner cannot transfer 100 to customer 1, while funds are locked', async function () {
            await expectThrow(this.token.transfer(fabCustomer1, 100, { from: owner }));
        });

        it('Exchange can freely transfer 100 to customer 1, while owner funds are locked', async function () {
            await this.token.transfer(fabCustomer1, 100, { from: exchangeAddress });
        });

        it('Owner tries to release coins and it succeeds, since its after releaseTime', async function () {
            await increaseTime(30)
            await this.timelock_contract.release()
            let balanceOfOwner = await this.token.balanceOf(owner);
            balanceOfOwner.toString().should.equal(`${_totalSupply * 80 / 100}`);
            let lockedBalance = await this.token.balanceOf(this.timelock_contract.address);
            lockedBalance.toString().should.equal('0');
        });

        it('Balance of customer 1 should be 100', async function () {
            const balance = await this.token.balanceOf(fabCustomer1);
            balance.toString().should.equal('100');
        });

        it('Balance of customer 2 should be 0', async function () {
            const balance = await this.token.balanceOf(fabCustomer2);
            balance.toString().should.equal('0');
        });

        it('Owner transfer 100 to customer 1', async function () {
            const status = await this.token.transfer(fabCustomer1, 100, {from: owner});
        });

        it('Balance of customer 1 should be 200', async function () {
            const balance = await this.token.balanceOf(fabCustomer1);
            balance.toString().should.equal('200');
        });

        it('Balance of owner should be 44 billion - 100', async function () {
            const balance = await this.token.balanceOf(owner);
            let x = _totalSupply * 80 / 100 - 100;
            balance.toString().should.equal(`${x}`);
        });
        
        it('Customer 1 tries to transfer more token than his balance to customer 2, he fails to do so', async function () {
            await expectThrow(this.token.transfer(fabCustomer2, 201, { from: fabCustomer1 }));
        });
    });
});
