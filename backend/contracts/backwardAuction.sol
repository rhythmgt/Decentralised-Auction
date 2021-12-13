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
	bool public auctionEnded = false;
	string public auctionFile = "None";

	/// Auction has already ended
	error AuctionAlreadyEnded();

	/// PreFiltering Phase Is Over
	error PreBidFilteringPhaseIsOver();

	/// PreFiltering Phase Is Not Over
	error PreBidFilteringPhaseIsNotOver();

	error AddressNotAllowed();

	constructor(uint filteringPeriod, uint biddingPd, address payable buyerAddress, uint maxBid, uint minDecrement, string memory file) payable{
		require(msg.value == maxBid);
		require(msg.sender == buyerAddress);
		buyer = buyerAddress;
		preBidFilteringEndTime = block.timestamp + filteringPeriod;
		auctionEndTime = block.timestamp + biddingPeriod + filteringPeriod*2;
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
			revert PreBidFilteringPhaseIsOver();
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
		if (block.timestamp > auctionEndTime || biddingAmount > lowestBid - minimumDecrement){
		    revert ("Either the auction has ended or the increment is below the threshold");
		}
		if (allowedAddresses[addr] == true){
			lowestBidder = addr;
			lowestBid = biddingAmount;
			return true;
		}
		else{
			revert ("Seller aot allowed to participate");
		}
	}


    function bid(uint biddingAmount) external returns (bool) {
		return bidding(msg.sender, biddingAmount);
	}

	function auctionEnd() public onlyBuyer {
		if (block.timestamp < auctionEndTime || auctionEnded){
			revert AuctionAlreadyEnded();
		}
		auctionEnded = true;
		payable(lowestBidder).transfer(lowestBid);
		payable(buyer).transfer(startBid - lowestBid);
	}
}