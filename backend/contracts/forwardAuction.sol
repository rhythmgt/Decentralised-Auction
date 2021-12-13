// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract forwardAuction{

	address payable public seller;
	uint public auctionEndTime;
	uint minimumBid = 0;
	uint minimumIncrement = 1; // refers to 1 percent
	address private highestBidder;
	uint public highestBid = 0;
	string public auctionFile = "None";

	bool public auctionEnded = false;
	bool withdrawAllowed = false;
	mapping(address => uint) private pendingReturns;








	constructor( uint biddingPeriod, address payable sellerAddress, uint minBid, uint minIncrement, bool allowWithdraw, string memory file){
		seller = sellerAddress;
		auctionEndTime = block.timestamp + biddingPeriod;
		minimumBid = minBid;
		minimumIncrement = minIncrement;
		withdrawAllowed = allowWithdraw;
	    auctionFile = file;
	}

	function bid() external payable{
		if (block.timestamp > auctionEndTime){
			revert ("Auction has already ended");
		}

		if (msg.value <= highestBid){
			revert ("This is not the highest bid");
		}

		if (msg.value <= minimumBid){
			revert ("Lesser than minimum bid");
		}

		if (pendingReturns[msg.sender] > 0 || highestBidder == msg.sender){
			revert ("Your bid already present");
		}

		if (highestBid > 0){
			pendingReturns[highestBidder] = highestBid;
		}
		highestBidder = msg.sender;
		highestBid = msg.value;
	}

	function incrementBid() external payable{
		if (block.timestamp > auctionEndTime){
			revert ("Auction has already ended");
		}
		
		uint prevValue = pendingReturns[msg.sender];
		
		if (msg.sender == highestBidder){
			prevValue = highestBid;
		}

		if (prevValue==0){
			revert ("Your bid is not present");
		}

		if (msg.value + prevValue <= highestBid){
			revert ("This is not the highest bid");
		}

		if (100*(msg.value+prevValue - highestBid) < highestBid*minimumIncrement){
			revert ("Lesser increment than threshold");
		}

		if (highestBid > 0){
			pendingReturns[highestBidder] = highestBid;
		}
		highestBidder = msg.sender;
		highestBid = prevValue + msg.value;
		pendingReturns[msg.sender] = 0;

	}

	function withdrawBid(address addr) internal returns (bool){
		if (!withdrawAllowed){
			revert ("Withdraw Not allowed before Auction End");
		}
		uint amt = pendingReturns[addr];
		if (amt==0) revert ("Withdraw Not allowed");

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
			revert ("Auction is Live or Auction has already ended");
		}

		auctionEnded = true;
		withdrawAllowed = true;
		payable(seller).transfer(highestBid);

	}

	function previousBid() external view returns (uint){
		if (msg.sender==highestBidder){
			return highestBid;
		}
		else{
			return pendingReturns[msg.sender];

		}
	}
}