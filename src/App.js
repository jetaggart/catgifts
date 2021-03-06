import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import QRCode from 'qrcode-react';


let userNode;

console.log(window.web3);
if (typeof window.web3 !== 'undefined') {
  userNode = new Web3(window.web3.currentProvider);
} else {
  console.error("failure");
}

console.log(userNode.eth.accounts[0]);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrCodeAddress: '',
      qrCodePrivateKey: '',
      address: '',
      privateKey: '',
      status: ''
    };
  }

  transferKitty = (kitty) => {
    const contractAddress = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";

    const account = this.state.address;
    const privateKey = this.state.privateKey;
    const toAddress = userNode.eth.accounts[0];

    this.setState({status: "sending cat to: " + toAddress});

    const that = this;
    userNode.eth.getTransactionCount(account, function (err, nonce) {
      console.log("building trnasaction");
      const data = userNode.eth
        .contract(kittyAbi)
        .at(contractAddress)
        .transfer
        .getData(toAddress, kitty.id);

      that.setState({status: "making transaction"});
      const tx = new Tx({
        nonce: nonce,
        gasPrice: userNode.toHex(userNode.toWei('5', 'gwei')),
        gasLimit: 100000,
        to: contractAddress,
        value: "0x00",
        data: data,
      });
      tx.sign(new Buffer(privateKey, 'hex'));

      console.log("sending transaction");
      const raw = '0x' + tx.serialize().toString('hex');
      userNode.eth.sendRawTransaction(raw, function (err, hash) {
        that.setState({status: `transaction sent: [err = ${err}] + [hash = ${hash}]`});
      });
    });

  };

  submit = () => {
    fetch(`https://api.cryptokitties.co/kitties?owner_wallet_address=${this.state.address}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.kitties.length < 1) {
          alert("no kitties, please make sure there's one kitty");
          return;
        }
        const kitty = json.kitties[0];
        this.transferKitty(kitty)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleAddress = (event) => {
    this.setState({qrCodeAddress: event.target.value});
  };

  handlePrivateKey = (event) => {
    this.setState({qrCodePrivateKey: event.target.value});
  };

  scanQRCode = () => {
    window.web3.currentProvider
      .scanQRCode(new RegExp(".*"))
      .then(data => {
        this.setState({status: data});
        const qrData = JSON.parse(data);
        this.setState({address: qrData.address});
        this.setState({privateKey: qrData.privateKey});
      })
      .catch(err => {
        this.setState({address: "fucked up: " + err})
      })
  };

  getQrCode = () => {
    return `{"address": "${this.state.qrCodeAddress}", "privateKey": "${this.state.qrCodePrivateKey}"}`;
  };

  render() {
    return (
      <div className="App">
        <div>
          <input id='address' placeholder='address' onChange={this.handleAddress} value={this.state.qrCodeAddress}/>
          <br/>
          <input id='privateKey' placeholder='privateKey' onChange={this.handlePrivateKey} value={this.state.qrCodePrivateKey}/>
          <br/>
          <QRCode value={this.getQrCode()} />
          <br/>
          <div>{this.getQrCode()}</div>
        </div>
        <br/>
        <br/>
        <br/>
        <button id='submit' onClick={this.scanQRCode}>Scan 1</button>
        <div>{this.state.address}</div>
        <div>{this.state.privateKey}</div>
        <div>{this.state.status}</div>
        <br/>
        <button id='submit' onClick={this.submit}>Submit</button>
      </div>
    );
  }

}

const kittyAbi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_kittyId",
        "type": "uint256"
      },
      {
        "name": "_recipient",
        "type": "address"
      }
    ],
    "name": "rescueLostKitty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "cfoAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "promoCreatedCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "ceoAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "implementsERC721",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "setSiringAuctionAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "siringAuction",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "setGeneScienceAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newCEO",
        "type": "address"
      }
    ],
    "name": "setCEO",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newCOO",
        "type": "address"
      }
    ],
    "name": "setCOO",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_kittyId",
        "type": "uint256"
      },
      {
        "name": "_startingPrice",
        "type": "uint256"
      },
      {
        "name": "_endingPrice",
        "type": "uint256"
      },
      {
        "name": "_duration",
        "type": "uint256"
      }
    ],
    "name": "createSaleAuction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "gen0CreationLimit",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "sireAllowedToAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_matronId",
        "type": "uint256"
      },
      {
        "name": "_sireId",
        "type": "uint256"
      }
    ],
    "name": "canBreedWith",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "tokensOfOwnerByIndex",
    "outputs": [
      {
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "kittyIndexToApproved",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_kittyId",
        "type": "uint256"
      },
      {
        "name": "_startingPrice",
        "type": "uint256"
      },
      {
        "name": "_endingPrice",
        "type": "uint256"
      },
      {
        "name": "_duration",
        "type": "uint256"
      }
    ],
    "name": "createSiringAuction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "val",
        "type": "uint256"
      }
    ],
    "name": "setAutoBirthFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_addr",
        "type": "address"
      },
      {
        "name": "_sireId",
        "type": "uint256"
      }
    ],
    "name": "approveSiring",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newCFO",
        "type": "address"
      }
    ],
    "name": "setCFO",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_genes",
        "type": "uint256"
      },
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "createPromoKitty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdrawBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "newContractAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "setSaleAuctionAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_matronId",
        "type": "uint256"
      },
      {
        "name": "_sireId",
        "type": "uint256"
      }
    ],
    "name": "breedWith",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "count",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_v2Address",
        "type": "address"
      }
    ],
    "name": "setNewAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_matronId",
        "type": "uint256"
      }
    ],
    "name": "giveBirth",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdrawAuctionBalances",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "cooldowns",
    "outputs": [
      {
        "name": "",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "kittyIndexToOwner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "gen0StartingPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "cooAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "autoBirthFee",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "promoCreationLimit",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_genes",
        "type": "uint256"
      }
    ],
    "name": "createGen0Auction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_kittyId",
        "type": "uint256"
      }
    ],
    "name": "isReadyToBreed",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "saleAuction",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getKitty",
    "outputs": [
      {
        "name": "isGestating",
        "type": "bool"
      },
      {
        "name": "isReady",
        "type": "bool"
      },
      {
        "name": "cooldownIndex",
        "type": "uint256"
      },
      {
        "name": "nextActionAt",
        "type": "uint256"
      },
      {
        "name": "siringWithId",
        "type": "uint256"
      },
      {
        "name": "birthTime",
        "type": "uint256"
      },
      {
        "name": "matronId",
        "type": "uint256"
      },
      {
        "name": "sireId",
        "type": "uint256"
      },
      {
        "name": "generation",
        "type": "uint256"
      },
      {
        "name": "genes",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "gen0AuctionDuration",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_sireId",
        "type": "uint256"
      },
      {
        "name": "_matronId",
        "type": "uint256"
      }
    ],
    "name": "bidOnSiringAuction",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "gen0CreatedCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "geneScience",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_matronId",
        "type": "uint256"
      },
      {
        "name": "_sireId",
        "type": "uint256"
      }
    ],
    "name": "breedWithAuto",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "matronId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "sireId",
        "type": "uint256"
      }
    ],
    "name": "Pregnant",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "matronId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "cooldownEndTime",
        "type": "uint256"
      }
    ],
    "name": "AutoBirth",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "kittyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "matronId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "sireId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "genes",
        "type": "uint256"
      }
    ],
    "name": "Birth",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "newContract",
        "type": "address"
      }
    ],
    "name": "ContractUpgrade",
    "type": "event"
  }
];

export default App;
