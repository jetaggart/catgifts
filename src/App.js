import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

var web3js;

console.log(window.web3);
if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(window.web3.currentProvider);
} else {
    console.error("failure");
}

console.log(web3js.eth.accounts[0]);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { address: '0x7f1382e17d7969ee5ac6a5107506cb6dc13bf9d8'};
    }

    submit = () => {
        console.error(this.state.address);
        fetch(`https://api.cryptokitties.co/kitties?owner_wallet_address=${this.state.address}`)
            .then((response) => response.json())
            .then((json) => {
                if (json.kitties.length < 1) {
                    console.alert("no kitties, please make sure there's one kitty");
                    return;
                }
                var kitty = json.kitties[0];
                console.log(kitty.id);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    handleAddresss = (event) => {
        this.setState({address: event.target.value});
    }

    render() {
        return (
                <div className="App">
                <input id='address' placeholder='address' onChange={this.handleAddress} value={this.state.value}/>
                <br/>
                <input id='privateKey' placeholder='privateKey'/>
                <br/>
                <button id='submit' onClick={this.submit}>Submit</button>
                </div>
        );
    }

}

export default App;
