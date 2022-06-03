const { assert } = require('chai');
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('EthSwap', ([deployer, investor]) =>{
    let token, ethSwap

    function tokens(n){
        return web3.utils.toWei(n,'ether');
    }

    before(async ()=>{
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
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

    describe('EthSwap buyTokens()', async ()=>{
        let result
        before(async ()=>{
           result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1','ether')});
        })        
        it('Allow users to purchase tokesn from EthSwap for a fixed price', async ()=>{            
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            // Check EthSwap balanaces after purchase
            let ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapTokenBalance.toString(),'999900000000000000000000' )
            let ethSwapEtherBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapEtherBalance.toString(),web3.utils.toWei('1','ether') )            

            // Check PurchaseToken event was emitted
            // console.log(result.logs)
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(),'100')
        })
    })   
    

    describe('EthSwap sellTokens()', async ()=>{
        let result
        before(async ()=>{
            // Investor must approve transactio
            await token.approve(ethSwap.address, tokens('100'), {from: investor});
            // Investor sells the tokens
            result = await ethSwap.sellTokens(tokens('100'),{from: investor});
        })        

        it('Allow users to sell tokens to EthSwap for a fixed price', async ()=>{ 
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0')) 
            
            // Check EthSwap balanaces after purchase
            let ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapTokenBalance.toString(),'1000000000000000000000000' )
            let ethSwapEtherBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapEtherBalance.toString(),web3.utils.toWei('0','ether') )   

            // Check TokenSold event was emitted
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(),'100')

            // FAILURE: Investors can't have more toekn than they have
            await ethSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected;

        })
    })      

})