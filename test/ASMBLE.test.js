const web3 = require('web3');

const BigNumber = web3.utils.BN;
var ASMBLE = artifacts.require("ASMBLE.sol");
const keccak256 = require('keccak256');
const { expectThrow } = require("./utils")

contract('ASMBLE', async (accounts) => {

    const _name = 'ASMBLE';
    const _symbol = 'SMBL';
    const _decimals = 18;
    const _initialSupply = 55000000000000000000000000000;

    const owner = accounts[0];
    const edgexUser1 = accounts[1];
    const edgexUser2 = accounts[2];
    const whaleAddress = accounts[4];


    const MINTER_ROLE = keccak256("MINTER_ROLE");
    const BURNER_ROLE = keccak256("BURNER_ROLE");
    const PAUSER_ROLE = keccak256("PAUSER_ROLE");

    beforeEach(async () => {
        /* before each context */
    })

    describe('token attributes', async function () {

        it('just deploy token', async function () {
            this.token = await ASMBLE.new(_name, _symbol);
        })


        it('Deploy and confirm token attributes', async function () {
            const name = await this.token.name();
            const symbol = await this.token.symbol();
            const decimals = await this.token.decimals();
            assert(name == _name)
            assert(symbol == _symbol)
            assert(decimals == _decimals.toString())
        });

        it('Owner can mint', async function () {
            let tomint = 1000;
            await this.token.mint(owner, tomint.toString())
        })

        it('Owner can pause', async function () {
            await this.token.pause()
        })

        it('Owner cannot mint when token in pause', async function () {
            let tomint = 1000;
            expectThrow(this.token.mint(owner, tomint.toString()))
        })

        it('Owner cannot burn when token in paused', async function () {
            let tomint = 1000;
            expectThrow(this.token.burn(accounts[5], tomint.toString()))
        })

        it('Owner cannot transfer when token is paused', async function () {
            let tomint = 1000;
            expectThrow(this.token.transfer(accounts[6], tomint.toString()))
            // await this.token.burn(accounts[6], tomint.toString(), { from: accounts[2] })
        });

        it('Owner can unpause', async function () {
            await this.token.unpause()
        })

        it('Owner can burn', async function () {
            let tomint = 1000;
            await this.token.transfer(accounts[5], tomint.toString())
            await this.token.burn(accounts[5], tomint.toString())
        })

        it('Owner can grant mint role', async function () {
            await this.token.grantRole(MINTER_ROLE, accounts[1])
        });

        it('Owner can grant burner role', async function () {
            await this.token.grantRole(BURNER_ROLE, accounts[2])
        });

        it('Owner can grant pauser role', async function () {
            await this.token.grantRole(PAUSER_ROLE, accounts[3])
        });



        it('Account with minter role can mint', async function () {
            let tomint = 1000;
            await this.token.mint(accounts[1], tomint.toString(), { from: accounts[1] })
        });

        it('Account with burner role can burn token from users account', async function () {
            let tomint = 1000;
            await this.token.transfer(accounts[6], tomint.toString())
            await this.token.burn(accounts[6], tomint.toString(), { from: accounts[2] })
        });


        it('Return true if account already has role', async function () {
            await this.token.hasRole(PAUSER_ROLE, accounts[3])
        })

        it('Owner can revoke mint role', async function () {
            await this.token.revokeRole(MINTER_ROLE, accounts[1])
        });

        it('Owner can revoke burner role', async function () {
            await this.token.revokeRole(BURNER_ROLE, accounts[2])
        });

        it('Owner can revoke pauser role', async function () {
            await this.token.revokeRole(PAUSER_ROLE, accounts[3])
        });


        it('Account with minter role cannot mint after role is revoked', async function () {
            let tomint = 1000;
            expectThrow(this.token.mint(accounts[1], tomint.toString(), { from: accounts[1] }))
        });


        it('Account with burner role cannot burn token from users account after role is revoked', async function () {
            let tomint = 10000;
            //await this.token.transfer(accounts[6], tomint.toString())
            expectThrow(this.token.burn(accounts[5], tomint.toString(), { from: accounts[1] }))
        });

        it('Owner cannot transfer funds from user1 to user2 without user1 permition', async function () {
            let tomint = 1000;
            expectThrow(this.token.transferFrom(accounts[5], accounts[6], tomint.toString()))
        })

    })
});


