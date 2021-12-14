// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract backwardAuction{

	address payable public buyer;
    uint public startBid;
	uint public preBidFilteringEndTime;
	uint public auctionEndTime;
	uint biddingPeriod;
	address[] public preBidParticipants;
	mapping (address=>string) public userDesc;
	address public lowestBidder;
	mapping (address=>bool) public allowedAddresses;
	uint public lowestBid;
	uint public minimumDecrement;
	uint public auctionPhase=0;
	string public auctionFile = "None";


	constructor(uint filteringPeriod, uint biddingPd, address payable buyerAddress, uint maxBid, uint minDecrement, string memory file) payable{
		require(msg.value == maxBid);
		require(msg.sender == buyerAddress);
		buyer = buyerAddress;
		preBidFilteringEndTime = block.timestamp + filteringPeriod;
		auctionEndTime = block.timestamp + biddingPd + filteringPeriod*2;
		biddingPeriod = biddingPd;
		lowestBid = maxBid;
		startBid = maxBid;
		minimumDecrement = minDecrement;
		auctionFile = file;
	}

	modifier onlyBuyer(){
        require (msg.sender == buyer, "Only buyer can call this function");
        _;
    }

	function uploadDescription( string calldata description) external{
		if (block.timestamp>preBidFilteringEndTime){
			revert ("Pre-bid Filtering phase is already over");
		}
		preBidParticipants.push(msg.sender);
		userDesc[msg.sender] = description;
	}

	function getPreBidParticipants()public view returns( address  [] memory){
    	return preBidParticipants;
	}

	function preBidFilter (address[] calldata selectedAccounts) external onlyBuyer(){
		if (block.timestamp<preBidFilteringEndTime){
			revert ("PreBid Filtering Phase Is Not Over");
		}
		for (uint j=0; j<selectedAccounts.length; j++){
			allowedAddresses[selectedAccounts[j]] = true;
		}
		auctionPhase = 1;
		// auctionEndTime = block.timestamp + biddingPeriod;
	}

	function bidding(address addr, uint biddingAmount) internal returns (bool){
		if (block.timestamp > auctionEndTime){
			revert ("The auction has ended");
		} 
		if(biddingAmount > lowestBid - minimumDecrement){
		    revert ("Bid amount doen not satify minimum decrement threshold");
		}
		if (allowedAddresses[addr] == true){
			lowestBidder = addr;
			lowestBid = biddingAmount;
			return true;
		}
		else{
			revert ("Seller not allowed to participate");
		}
	}


    function bid(uint biddingAmount) external returns (bool) {
		return bidding(msg.sender, biddingAmount);
	}

	function auctionEnd() public onlyBuyer {
		if (block.timestamp < auctionEndTime || auctionPhase==2){
			revert ("Auction is Currently Live or Auction already Ended");
		}
		auctionPhase=2;
		payable(lowestBidder).transfer(lowestBid);
		payable(buyer).transfer(startBid - lowestBid);
	}
}