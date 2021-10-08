// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract forwardAuction{

	address payable public seller;
	uint public auctionEndTime;
	uint minimum_Bid = 0;
	address public highestBidder;
	uint public highestBid = 0;

	bool auctionEnded = false;
	mapping(address => uint) public pendingReturns;
	address[] bidders = new address[](0);

	/// Auction has already ended
	error AuctionAlreadyEnded();

	/// This is not the highest bid
	error NotHighestBid();

	/// Auction Ending Time not reached yet
	error EndingTimeNotReached();

	/// Your bid already present
	error BidAlreadyPresent();

	/// Your bid is not present
	error BidNotPresent();

	/// Lesser than minimum bid
	error LesserThanMin();

	constructor( uint biddingPeriod, address payable sellerAddress, uint minBid){
		seller = sellerAddress;
		auctionEndTime = block.timestamp + biddingPeriod;
		minimum_Bid = minBid;
	}

	function bid() external payable{
		if (block.timestamp > auctionEndTime){
			revert AuctionAlreadyEnded();
		}

		if (msg.value <= highestBid){
			revert NotHighestBid();
		}

		if (msg.value < minimum_Bid){
			revert LesserThanMin();
		}

		if (pendingReturns[msg.sender] > 0){
			revert BidAlreadyPresent();
		}

		bidders.push(msg.sender);
		if (highestBid > 0){
			pendingReturns[highestBidder] = highestBid;
		}
		highestBidder = msg.sender;
		highestBid = msg.value;
	}

	function incrementBid() external payable{
		if (block.timestamp > auctionEndTime){
			revert AuctionAlreadyEnded();
		}
		
		uint prevValue = pendingReturns[msg.sender];
		
		if (msg.sender == highestBidder){
			prevValue = highestBid;
		}

		if (prevValue==0){
			revert BidNotPresent();
		}

		if (msg.value + prevValue <= highestBid){
			revert NotHighestBid();
		}

		if (msg.value + prevValue < minimum_Bid){
			revert LesserThanMin();
		}

		if (highestBid > 0){
			pendingReturns[highestBidder] = highestBid;
		}
		highestBidder = msg.sender;
		highestBid = prevValue + msg.value;
		pendingReturns[msg.sender] = 0;

	}

	function withdrawBid(address addr) internal returns (bool){
		uint amt = pendingReturns[addr];
		if (amt==0) return true;

		pendingReturns[addr] = 0;

		if (!payable(addr).send(amt)){
			pendingReturns[addr] = amt;
			return false;
		}
		return true;
	}

	function withdraw() external returns (bool) {
		return withdrawBid(msg.sender);
	}

	function auctionEnd() external {

		if (block.timestamp < auctionEndTime || auctionEnded){
			revert AuctionAlreadyEnded();
		}

		auctionEnded = true;

		payable(seller).transfer(highestBid);
		for (uint i=0; i<bidders.length; i++){
			withdrawBid(bidders[i]);
		}

	}
}