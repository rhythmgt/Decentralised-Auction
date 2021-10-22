// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract backwardAuction{

	address payable public buyer;
    uint public startBid;
	uint public auctionEndTime;
	address public lowestBidder;
	uint public lowestBid;
	uint public minimumDecrement;
	bool auctionEnded = false;

	/// Auction has already ended
	error AuctionAlreadyEnded();

	constructor( uint biddingPeriod, address payable buyerAddress, uint maxBid, uint minDecrement) payable{
		require(msg.value == maxBid);
		require(msg.sender == buyerAddress);
		buyer = buyerAddress;
		auctionEndTime = block.timestamp + biddingPeriod;
		lowestBid = maxBid;
		startBid = maxBid;
		minimumDecrement = minDecrement;
	}

	modifier onlyBuyer(){
        require (msg.sender == buyer, "Only buyer can call this function");
        _;
    }


	function bidding(address addr, uint biddingAmount) internal returns (bool){
		if (block.timestamp > auctionEndTime || biddingAmount > lowestBid - minimumDecrement){
		    return false;
		}
		lowestBidder = addr;
		lowestBid = biddingAmount;
		return true;
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