const { expectThrow } = require('./util');

const BigNumber = web3.utils.BN;
const FABToken = artifacts.require('ManualToken');

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('ManualToken', async (accounts) => {
    const owner = accounts[0];
    const fabCustomer1 = accounts[1];
    const fabCustomer2 = accounts[2];
    const fabCustomer3 = accounts[3];
    const _totalSupply = 55000000000;

    beforeEach(async function () {
    });

    describe('token attributes', async function () {
        it('Deploy', async function () {
            this.token = await FABToken.new();
        });

        it('Transfer 20% each to 3 different addresses', async function () {
            await this.token.transfer(fabCustomer1, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'))
            await this.token.transfer(fabCustomer2, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'))
            await this.token.transfer(fabCustomer3, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'))
        });
        
        it('Owner lock contract', async function () {
            await this.token.setLockToken(true)
        });

        it('owner address owning Fab and Owner try to transfer tokens and it should fail', async function () {
            await expectThrow(this.token.transfer(fabCustomer1, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether')))
        });

        it('address 1 owning Fab and Owner try to transfer tokens and it should fail', async function () {
            await expectThrow(this.token.transfer(fabCustomer2, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'), { from: fabCustomer1 }))
        });

        it('address 2 owning Fab and Owner try to transfer tokens and it should fail', async function () {
            await expectThrow(this.token.transfer(fabCustomer3, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'), { from: fabCustomer2 }))
        });

        it('address 3 owning Fab and Owner try to transfer tokens and it should fail', async function () {
            await expectThrow(this.token.transfer(owner, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'), { from: fabCustomer3 }))
        });

        it('Soemone else unlock contract', async function () {
            await expectThrow(this.token.setLockToken(false, { from: fabCustomer3}))
        });

        it('Owner unlock contract', async function () {
            await this.token.setLockToken(false)
        });

        it('owner address owning Fab and Owner try to transfer tokens and it should succeed', async function () {
            await this.token.transfer(fabCustomer1, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'))
        });

        it('address 1 owning Fab and Owner try to transfer tokens and it should succeed', async function () {
            await this.token.transfer(fabCustomer2, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'), { from: fabCustomer1 })
        });

        it('address 2 owning Fab and Owner try to transfer tokens and it should succeed', async function () {
            await this.token.transfer(fabCustomer3, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'), { from: fabCustomer2 })
        });

        it('address 3 owning Fab try to transfer tokens and it should succeed', async function () {
            await this.token.transfer(owner, web3.utils.toWei((_totalSupply * 20 / 100).toString(), 'ether'), { from: fabCustomer3 })
        });

        it('Owner freezes 50% of address 3 balance', async function () {
            let balance = _totalSupply * 10 / 100;
            await this.token.freezeAmount(fabCustomer3, web3.utils.toWei((balance).toString(), 'ether'));
        });

        it('Owner sets isUseFreeze to true', async function () {
            await this.token.setUseFreeze(true)
        });

        it('address 3 tries to transfer 60% balance to someone else and fails', async function () {
            let balance = _totalSupply * 12 / 100;
            await expectThrow(this.token.transfer(owner, web3.utils.toWei((balance).toString(), 'ether'), { from: fabCustomer3 }))
        });

        it('address 3 tries to transfer 50% balance to someone else and succeeds', async function () {
            let balance = _totalSupply * 10 / 100;
            await this.token.transfer(owner, web3.utils.toWei((balance).toString(), 'ether'), { from: fabCustomer3 })
        });

        it('Owner updates freeze amount to 60% of remaining address 3 balance', async function () {
            let balance = _totalSupply * 6 / 100;
            await this.token.freezeAmount(fabCustomer3, web3.utils.toWei((balance).toString(), 'ether'))
        });

        it('address 3 tries to transfer 50% balance to someone else and fails', async function () {
            let balance = _totalSupply * 5 / 100;
            await expectThrow(this.token.transfer(owner, web3.utils.toWei((balance).toString(), 'ether'), { from: fabCustomer3 }))
        });

        it('address 3 tries to transfer 40% balance to someone else and succeeds', async function () {
            let balance = _totalSupply * 4 / 100;
            await this.token.transfer(owner, web3.utils.toWei((balance).toString(), 'ether'), { from: fabCustomer3 })
        });

        it('Owner sets isUseFreeze to false', async function () {
            await this.token.setUseFreeze(false)
        });

        it('address 3 tries to transfer rest of his balance to someone else and succeeds', async function () {
            let balance = _totalSupply * 6 / 100;
            await this.token.transfer(owner, web3.utils.toWei((balance).toString(), 'ether'), { from: fabCustomer3 })
        });

    });
});
