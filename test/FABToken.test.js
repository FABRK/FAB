const BigNumber = web3.BigNumber;

const FABToken = artifacts.require('FABToken');

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

    beforeEach(async function () {
    });

    describe('token attributes', async function () {
        it('Deploy', async function () {
            this.token = await FABToken.new(_name, _symbol, _decimals);
        });

        it('Total Supply is 55 billion', async function () {
            const totalSupply = await this.token.totalSupply();
            totalSupply.should.be.bignumber.equal(_totalSupply);
        });

        it('Owner has 55 billion balance , i.e total supply', async function () {
            const balanceOfOwner = await this.token.balanceOf(owner);
            balanceOfOwner.should.be.bignumber.equal(_totalSupply);
        });

        it('Balance of customer 1 should be 0', async function () {
            const balance = await this.token.balanceOf(fabCustomer1);
            balance.should.be.bignumber.equal(0);
        });

        it('Balance of customer 2 should be 0', async function () {
            const balance = await this.token.balanceOf(fabCustomer2);
            balance.should.be.bignumber.equal(0);
        });

        it('Owner transferr 100 to customer 1', async function () {
            const status = await this.token.transfer(fabCustomer1, 100);
        });

        it('Balance of customer 1 should be  100', async function () {
            const balance = await this.token.balanceOf(fabCustomer1);
            balance.should.be.bignumber.equal(100);
        });

        it('Balance of owner should be 55bilion - 100', async function () {
            const balance = await this.token.balanceOf(owner);
            let x = _totalSupply - 100;
            balance.should.be.bignumber.equal(x);
        });
        
        it('Customer 1 tries to transfer more token than his balance to customer 2 , he fails to do so', async function () {
            try {
                await this.token.transfer(fabCustomer2, 101, {from: fabCustomer1});
            } catch (e) {
                const balance = await this.token.balanceOf(fabCustomer2);
                balance.should.be.bignumber.equal(0);
            }
        });

        it('Someone tries to register,he fails to do so, as balance is 0', async function () {
            try {
                await this
                    .token
                    .register("fabxxxxyyyycccccFABARREss", { from: fabCustomer2 });
            } catch (e) {
            }
            let x = await this
                .token
                .keys(fabCustomer2)
            x.should.equal('')
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

        it('Owner tries to transfer 10 token  to customer 2 , he fails to do so , As all tx ' +
            'are paused  ',
            async function () {
                try {
                    await this
                        .token
                        .transfer(fabCustomer2, 10, { from: owner });
                } catch (e) {
                    const balance = await this
                        .token
                        .balanceOf(fabCustomer2);
                    balance
                        .should
                        .be
                        .bignumber
                        .equal(0);
                }
            });

        it('Someone tries to register,he fails to do so , As all tx are paused', async function () {
            try {
                await this
                    .token
                    .register("fabxxxxyyyycccccFABARREss", { from: fabCustomer1 });
            } catch (e) {
            }
            let x = await this
                .token
                .keys(fabCustomer3)
            x.should.equal('')
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

        it('Someone tries to register,succeed now after resuming , As all tx are resumed', async function () {
            try {
                await this
                    .token
                    .register("fabxxxxyyyycccccFABARREss", { from: fabCustomer1 });
            } catch (e) {
            }

            let x = await this
                .token
                .keys(fabCustomer1)
            x.should.equal("fabxxxxyyyycccccFABARREss")
        });
    });
});
