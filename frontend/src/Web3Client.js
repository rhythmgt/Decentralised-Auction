import Web3 from 'web3';
import forwardAuctionBuild from 'contracts/forwardAuction.json';

let selectedAccount;

let forwardAuctionContract;
let isInitialised = false;
export const init = async () =>{
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

		const web3 = new Web3(provider);
		const networkId = await web3.eth.net.getId();
		forwardAuctionContract = new web3.eth.Contract(forwardAuctionBuild.abi , forwardAuctionBuild.networks[networkId].address);
		console.log("Contract address", forwardAuctionBuild.networks[networkId]);
		console.log("forwardAuction", forwardAuctionContract);
		isInitialised = true;

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
		console.log(err);
	})
	;
};

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
	// return [highestBid, highestBidder];
}