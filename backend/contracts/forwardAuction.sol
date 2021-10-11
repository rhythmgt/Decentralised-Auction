// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract forwardAuction{

	address payable public seller;
	uint public auctionEndTime;
	uint minimumBid = 0;
	uint minimumIncrement = 1; // refers to 1 percent
	address public highestBidder;
	uint public highestBid = 0;

	bool auctionEnded = false;
	bool withdrawAllowed = false;
	mapping(address => uint) public pendingReturns;

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

	/// Lesser increment than threshold
	error LesserIncrementThanThresh();

	/// Withdraw Not allowed before Auction End
	error WithdrawNotAllowed();

	constructor( uint biddingPeriod, address payable sellerAddress, uint minBid, uint minIncrement, bool allowWithdraw){
		seller = sellerAddress;
		auctionEndTime = block.timestamp + biddingPeriod;
		minimumBid = minBid;
		minimumIncrement = minIncrement;
		withdrawAllowed = allowWithdraw;
	}

	function bid() external payable{
		if (block.timestamp > auctionEndTime){
			revert AuctionAlreadyEnded();
		}

		if (msg.value <= highestBid){
			revert NotHighestBid();
		}

		if (msg.value < minimumBid){
			revert LesserThanMin();
		}

		if (pendingReturns[msg.sender] > 0 || highestBidder == msg.sender){
			revert BidAlreadyPresent();
		}

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

		if (100*(msg.value+prevValue - highestBid) < highestBid*minimumIncrement){
			revert LesserIncrementThanThresh();
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
			revert WithdrawNotAllowed();
		}
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
		withdrawAllowed = true;
		payable(seller).transfer(highestBid);

	}
}