export class forwardAuctionClient{
	constructor(contract, address){
		this.forwardAuctionContract = contract;
		this.selectedAccount = address;		
	}

	getSeller = async ()=>{
		return await this.forwardAuctionContract.methods.seller().call({from: this.selectedAccount});
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

	getIsEnded = async () => {
		return await this.forwardAuctionContract.methods.auctionEnded().call({from: this.selectedAccount});
	}

	getEndTime = async () =>{
		return await this.forwardAuctionContract.methods.auctionEndTime().call({from: this.selectedAccount});
	}

	bid = async (bidVal) => {
	
		console.log('Trying bid', bidVal);
		return await this.forwardAuctionContract.methods
			.bid()
			.send({from: this.selectedAccount, value: bidVal})
			.then((tx)=>{
				console.log(tx);
			})
			.catch((err)=>{
				console.log(err)
				alert(err)
			});
	
	};

	incrementBid = async (incrementValue) => {
		
	
		console.log('Trying increment', incrementValue);
		return await this.forwardAuctionContract.methods
		.incrementBid()
		.send({from: this.selectedAccount, value: incrementValue})
		.then((tx)=>{
			console.log(tx);
		})
		.catch((err)=>{
			console.log(err)
			alert(err)
		});
		
	}

	withdrawBid = async() => {
		
		console.log('Trying withdraw');
		return await this.forwardAuctionContract.methods
		.withdraw()
		.send({from: this.selectedAccount})
		.then((tx)=>{
			console.log(tx);
		})
		.catch((err)=>{
			console.log(err)
			alert(err)
		});
		
	}
	auctionEnd = async() => {
		
		console.log('Trying to end auction');
		return await this.forwardAuctionContract.methods
		.auctionEnd()
		.send({from: this.selectedAccount})
		.then((tx)=>{
			console.log(tx);
		})
		.catch((err) =>{
			console.log(err);
			alert(err)

		});
	}
}