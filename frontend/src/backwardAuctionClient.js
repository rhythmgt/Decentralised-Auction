export class backwardAuctionClient{
	constructor(contract, address){
		this.backwardAuctionContract = contract;
		this.selectedAccount = address;
		
	}

	getBuyer = async ()=>{
		return await this.backwardAuctionContract.methods.buyer().call({from: this.selectedAccount});
	}


	getDocumentLink = async ()=>{
		return await this.backwardAuctionContract.methods.auctionFile().call({from: this.selectedAccount});

	}
	getLowestBid = async () => {
		return await this.backwardAuctionContract.methods.lowestBid().call({from: this.selectedAccount});
		
	}

	bid = async (bidVal) => {
	
		console.log('Trying bid', bidVal);
		return await this.backwardAuctionContract.methods
			.bid(bidVal)
			.send({from: this.selectedAccount})
	
	};

	auctionEnd = async() => {
		
		console.log('Trying to end auction');
		return this.backwardAuctionContract.methods
		.auctionEnd()
		.send({from: this.selectedAccount})
		.then((tx)=>{
		console.log(tx);
		})
		.catch((err) =>{
			console.log(err);
		});
	}
}