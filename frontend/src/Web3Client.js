import Web3 from 'web3';
import forwardAuctionBuild from 'contracts/forwardAuction.json';

let selectedAccount;

let isInitialised = false;

const deploy_addr = "0x0050785b8816C8dEca10DA5Ee8510e81cE98Ff99";

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
let forwardAuctionContract = new web3.eth.Contract(forwardAuctionBuild.abi);

export const init = async () =>{
	forwardAuctionContract.options.data = forwardAuctionBuild.bytecode;
	forwardAuctionContract.deploy({
		arguments: [1000, deploy_addr , 0, 0, true]
	})
	.send({
		from: deploy_addr,
		gas: 6721975,
		gasPrice: '2'
	})
	.then(function(newContractInstance){
		console.log("Deployed:", newContractInstance.options.address) // instance with the new contract address
		forwardAuctionContract = newContractInstance;
		console.log("forwardAuction", forwardAuctionContract);

		let provider = window.ethereum;	
		if (typeof provider !== 'undefined'){

			provider.request({method: 'eth_requestAccounts'}).then(
				(accounts) => {
					selectedAccount= accounts[0];
					console.log(`Selected account is ${selectedAccount}`);
				}
			).catch(
				(err) => {
					console.log(err);
					return;
				}
			);
			window.ethereum.on('accountsChanged', (accounts)=>{
				selectedAccount = accounts[0];
				console.log(`Selected account is ${selectedAccount}`);
			})
		}

		else{
			console.log ("This will work only with modern browsers and Metamask installed");
			return;
		}
		isInitialised = true;

	})
	.catch((err) =>{
		console.log(err);
		return;
	});

}

// functions of forwardAuction

export const bid = async (bidVal) => {
	if (!isInitialised){
		await init();
	}

	console.log('Trying bid', bidVal);
	return forwardAuctionContract.methods
	.bid()
	.send({from: selectedAccount, value: bidVal})
	.then((tx)=>{
	console.log(tx);
	})
	.catch((err) =>{
		console.log("Bidding Error", err);
	});
};

export const incrementBid = async (incrementValue) => {
	if (!isInitialised){
		await init();
	}

	console.log('Trying increment', incrementValue);
	return forwardAuctionContract.methods
	.incrementBid()
	.send({from: selectedAccount, value: incrementValue})
	.then((tx)=>{
	console.log(tx);
	})
	.catch((err) =>{
		console.log(err);
	});
}


export const getHighestBid = async () => {
	if (!isInitialised){
		await init();
	}
	forwardAuctionContract.methods.highestBid().call({from: selectedAccount}).then((tx)=>{
		console.log(tx);
		})
		.catch((err) =>{
			console.log(err);
		});
	forwardAuctionContract.methods.highestBidder().call({from: selectedAccount}).then((tx)=>{
		console.log(tx);
		})
		.catch((err) =>{
			console.log(err);
		});
}

export const withdrawBid = async() => {
	if (!isInitialised){
		await init();
	}

	console.log('Trying withdraw');
	return forwardAuctionContract.methods
	.withdraw()
	.send({from: selectedAccount})
	.then((tx)=>{
	console.log(tx);
	})
	.catch((err) =>{
		console.log(err);
	});
}

export const getPendingReturns = async() => {
	if (!isInitialised){
		await init();
	}

	console.log('Fetching pending return');
	return forwardAuctionContract.methods
	.pendingReturns(selectedAccount)
	.call({from: selectedAccount})
	.then((tx)=>{
	console.log(tx);
	})
	.catch((err) =>{
		console.log(err);
	});
}

export const auctionEnd = async() => {
	if (!isInitialised){
		await init();
	}

	console.log('Trying to end auction');
	return forwardAuctionContract.methods
	.auctionEnd()
	.send({from: selectedAccount})
	.then((tx)=>{
	console.log(tx);
	})
	.catch((err) =>{
		console.log(err);
	});
}
