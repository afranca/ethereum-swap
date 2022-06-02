const { assert } = require('chai');
const { default: Web3 } = require('web3');
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('EthSwap', (accounts) =>{
    let token, ethSwap

    function tokens(n){
        return web3.utils.toWei(n,'ether');
    }

    before(async ()=>{
        token = await Token.new()
        ethSwap = await EthSwap.new()
        await token.transfer(ethSwap.address, tokens('1000000'))  
    })

    describe('Token deployment', async ()=>{
        it('contract has a name', async ()=>{
            const name = await token.name()
            assert.equal(name, 'DApp Token')

        })
    })

    describe('EthSwap deployment', async ()=>{
        it('contract has a name', async ()=>{
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('EthSwap has Tokens', async ()=>{  
            let ethSwapBalance =  await token.balanceOf(ethSwap.address)    
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))
        })
    })

})