import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar';

class App extends Component {

  // Special lifecycle function in React
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBloackchainData()
  }

  async loadBloackchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    console.log("State.account: "+this.state.account)
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance: ethBalance})
    console.log("State.ethBalance: "+this.state.ethBalance)
  }

  // This is how you hook it up with Metamask (Provided by Metamask)
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non ethereum browser detected. You should consider Metamask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      ethBalance: '0'
    }
  }

  render() {
    return (
      <div>
        <Navbar account = {this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                <h1>Hello World</h1>
               
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
