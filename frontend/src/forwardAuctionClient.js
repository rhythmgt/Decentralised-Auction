export class forwardAuctionClient{
	constructor(contract, address){
		this.forwardAuctionContract = contract;
		this.selectedAccount = address;
		this.forwardAuctionContract.methods.seller().call({from: this.selectedAccount}).then((tx) => {
			this.seller =  tx;
		})
		.catch((err) => {
			console.log(err);
		});
	}

	isSeller = ()=>{
		console.log(this.selectedAccount, this.seller);
		return this.selectedAccount === this.seller ;
	}

	getDocumentLink = async ()=>{
		return await this.forwardAuctionContract.methods.auctionFile().call({from: this.selectedAccount});

	}
	getHighestBid = async () => {
		return await this.forwardAuctionContract.methods.highestBid().call({from: this.selectedAccount});
		
	}

	getPreviousBid = async () => {
		return await this.forwardAuctionContract.methods.previousBid().call({from: this.selectedAccount});
	}

	bid = async (bidVal) => {
	
		console.log('Trying bid', bidVal);
		return await this.forwardAuctionContract.methods
			.bid()
			.send({from: this.selectedAccount, value: bidVal})
	
	};

	incrementBid = async (incrementValue) => {
		
	
		console.log('Trying increment', incrementValue);
		return await this.forwardAuctionContract.methods
		.incrementBid()
		.send({from: this.selectedAccount, value: incrementValue})
		
	}

	withdrawBid = async() => {
		
		console.log('Trying withdraw');
		return await this.forwardAuctionContract.methods
		.withdraw()
		.send({from: this.selectedAccount})
		
	}
	auctionEnd = async() => {
		
		console.log('Trying to end auction');
		return this.forwardAuctionContract.methods
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