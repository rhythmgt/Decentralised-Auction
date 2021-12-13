export class backwardAuctionClient {
    constructor(contract, address) {
        this.backwardAuctionContract = contract;
        this.selectedAccount = address;

    }

    getBuyer = async () => {
        return await this.backwardAuctionContract.methods.buyer().call({from: this.selectedAccount});
    }


    getDocumentLink = async () => {
        return await this.backwardAuctionContract.methods.auctionFile().call({from: this.selectedAccount});

    }
    getLowestBid = async () => {
        return await this.backwardAuctionContract.methods.lowestBid().call({from: this.selectedAccount});

    }

    getPreBidParticipants = async () => {
        return await this.backwardAuctionContract.methods.getPreBidParticipants().call({from: this.selectedAccount});
    }

    getDescriptions = async (p) => {
        return await this.backwardAuctionContract.methods.userDesc(p).call({from: this.selectedAccount})

    }

    getAuctionPhase = async () => {
        return await this.backwardAuctionContract.methods.auctionPhase().call({from: this.selectedAccount});

    }
    uploadUserDescription = async (url) => {
        return await this.backwardAuctionContract.methods
            .uploadDescription(url)
            .send({from: this.selectedAccount, gas: 200000})
            .then((tx) => {
                console.log(tx);
            })
            .catch((err) => {
                console.log(err);
            });
        // return await this.backwardAuctionContract.methods
        // .uploadDescription(url)
        // .estimateGas({from: this.selectedAccount})
        // .then((tx)=>{
        // console.log(tx);
        // })
        // .catch((err) =>{
        // 	console.log(err);
        // })
    }

    preBidFilter = async (arr) => {
        return await this.backwardAuctionContract.methods
            .preBidFilter(arr)
            .send({from: this.selectedAccount})
            .then((tx) => {
                console.log(tx);
                alert("Seller filtered successfully and auctions started!!!!!!")
            })
            .catch((err) => {
                alert(err)
            });
    }

    bid = async (bidVal) => {

        console.log('Trying bid', bidVal);
        return await this.backwardAuctionContract.methods
            .bid(bidVal)
            .send({from: this.selectedAccount})

    };

    auctionEnd = async () => {

        console.log('Trying to end auction');
        return await this.backwardAuctionContract.methods
            .auctionEnd()
            .send({from: this.selectedAccount})
            .then((tx) => {
                console.log(tx);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}