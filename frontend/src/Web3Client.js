import Web3 from 'web3';
import forwardAuctionBuild from 'contracts/forwardAuction.json';

let selectedAccount = '0xec3a5e35df6a6be82c0f1c3a71e394f8d689196a';

let isInitialised = false;

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let forwardAuctionContract = new web3.eth.Contract(forwardAuctionBuild.abi);

export const init = async () => {


    forwardAuctionContract.options.data = forwardAuctionBuild.bytecode;
    forwardAuctionContract.deploy({
        arguments: [1000, selectedAccount, 0, 0, false]
    })
        .send({
            from: selectedAccount,
            gas: 6721975,
            gasPrice: '2'
        })
        .then(function (newContractInstance) {
            console.log("Deployed:", newContractInstance.options.address) // instance with the new contract address
            forwardAuctionContract = newContractInstance;
            console.log("forwardAuction", forwardAuctionContract);

        })
        .catch((err) => {
            console.log(err);
            return;
        });

}

// functions of forwardAuction

export const bid = async (bidVal) => {
    if (!isInitialised) {
        await init();
    }

    console.log('Trying bid', bidVal);
    return forwardAuctionContract.methods
        .bid()
        .send({from: selectedAccount, value: bidVal})
        .then((tx) => {
            console.log(tx);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getHighestBid = async () => {
    if (!isInitialised) {
        await init();
    }
    forwardAuctionContract.methods.highestBid().call({from: selectedAccount}).then((tx) => {
        console.log(tx);
    })
        .catch((err) => {
            console.log(err);
        });
    forwardAuctionContract.methods.highestBidder().call({from: selectedAccount}).then((tx) => {
        console.log(tx);
    })
        .catch((err) => {
            console.log(err);
        });
}