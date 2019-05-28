const { increaseTime, expectThrow, latestTime } = require('./util');

const BigNumber = web3.BigNumber;
const FABToken = artifacts.require('FABToken');
const FABTokenTimelock = artifacts.require('FABTokenTimelock')

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
    const fabCustomer3 = accounts[3];
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
            totalSupply.should.be.bignumber.equal(_totalSupply);
        });

        it('Owner has 80% of 55 billion balance , i.e total supply', async function () {
            const balanceOfOwner = await this.token.balanceOf(owner);
            balanceOfOwner.should.be.bignumber.equal(_totalSupply * 80 / 100);
        });

        it('Owner locks up all his coins in the Timelock contract, his balance should be 0, timelock contract should own 80% of coins', async function () {
            let balanceOfOwner = await this.token.balanceOf(owner);
            await this.token.transfer(this.timelock_contract.address, balanceOfOwner);
            balanceOfOwner = await this.token.balanceOf(owner);
            balanceOfOwner.should.be.bignumber.equal(0);
            let lockedBalance = await this.token.balanceOf(this.timelock_contract.address);
            lockedBalance.should.be.bignumber.equal(_totalSupply * 80 / 100);
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
            balanceOfOwner.should.be.bignumber.equal(_totalSupply * 80 / 100);
            let lockedBalance = await this.token.balanceOf(this.timelock_contract.address);
            lockedBalance.should.be.bignumber.equal(0);
        });

        it('Balance of customer 1 should be 100', async function () {
            const balance = await this.token.balanceOf(fabCustomer1);
            balance.should.be.bignumber.equal(100);
        });

        it('Balance of customer 2 should be 0', async function () {
            const balance = await this.token.balanceOf(fabCustomer2);
            balance.should.be.bignumber.equal(0);
        });

        it('Owner transfer 100 to customer 1', async function () {
            const status = await this.token.transfer(fabCustomer1, 100, {from: owner});
        });

        it('Balance of customer 1 should be 200', async function () {
            const balance = await this.token.balanceOf(fabCustomer1);
            balance.should.be.bignumber.equal(200);
        });

        it('Balance of owner should be 44 billion - 100', async function () {
            const balance = await this.token.balanceOf(owner);
            let x = _totalSupply * 80 / 100 - 100;
            balance.should.be.bignumber.equal(x);
        });
        
        it('Customer 1 tries to transfer more token than his balance to customer 2, he fails to do so', async function () {
            await expectThrow(this.token.transfer(fabCustomer2, 201, { from: fabCustomer1 }));
        });

        it('Someone tries to register,he fails to do so, as balance is 0', async function () {
            await expectThrow(this
                .token
                .register("fabxxxxyyyycccccFABARREss", { from: fabCustomer2 }));

            let x = await this
                .token
                .keys(fabCustomer2)
            x.should.equal('')
        });

        it('Non owner tries to Pause/Stop all transactions, it fails', async function () {
            await expectThrow(this
                .token
                .pause({ from: fabCustomer1 }));
            const paused = await this
                .token
                .paused();
            paused
                .should
                .equal(false);
        });

        it('Pause/Stop all transactions ', async function () {
            await this
                .token
                .pause();
            const paused = await this
                .token
                .paused();
            paused
                .should
                .equal(true);
        });

        it('Exchange tries to transfer 10 token  to customer 2, he fails to do so , As all tx ' +
            'are paused  ',
            async function () {

                await expectThrow(this
                    .token
                    .transfer(fabCustomer2, 10, { from: exchangeAddress }));

            });

        it('Someone tries to register,he fails to do so , As all tx are paused', async function () {
            await expectThrow(this
                .token
                .register("fabxxxxyyyycccccFABARREss", { from: fabCustomer1 }));

            let x = await this
                .token
                .keys(fabCustomer3)
            x.should.equal('')
        });

        it('Someone tries to claim,he fails to do so , As all tx are paused and they have not registered', async function () {
            await expectThrow(this
                .token
                .claim({ from: fabCustomer1 }));
            const balance = await this
                .token
                .balanceOf(fabCustomer1);
            balance.should
                .be
                .bignumber
                .equal(200);
        });

        it('Resume all transactions ', async function () {
            await this
                .token
                .unpause();
            const paused = await this
                .token
                .paused();
            paused
                .should
                .equal(false);
        });

        it('Someone tries to claim,he fails to do so, As they have not registered', async function () {
            await expectThrow(this
                .token
                .claim({ from: fabCustomer1 }))
            
            const balance = await this
                .token
                .balanceOf(fabCustomer1);
            balance.should
                .be
                .bignumber
                .equal(200);
        });

        it('Someone tries to register,succeed now after resuming , As all tx are resumed', async function () {
            await this
                .token
                .register("fabxxxxyyyycccccFABARREss", { from: fabCustomer1 });


            let x = await this
                .token
                .keys(fabCustomer1)
            x.should.equal("fabxxxxyyyycccccFABARREss")
        });

        it('Someone tries to claim, and it succeeds emitting an event and burning their token balance', async function () {
            await this
                .token
                .claim({ from: fabCustomer1 });

            const balance = await this
                .token
                .balanceOf(fabCustomer1);
            balance.should
                .be
                .bignumber
                .equal(0);
        });
    });
});
