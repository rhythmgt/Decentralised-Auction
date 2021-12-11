import React, {useState} from "react";
import {useParams} from "react-router-dom";
import Web3 from 'web3';
import ViewForwardAuction from "./ViewForwardAuction";
import ViewBackwardAuction from "./ViewBackwardAuction";
import forwardAuctionBuild from 'contracts/forwardAuction.json';
import backwardAuctionBuild from 'contracts/backwardAuction.json';


const ViewAuction = (props) => {
    const {add, type} = useParams();
	const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
	web3.eth.handleRevert = true
	if (props.selectedAccount === false) {
        return (<div id="homesec"><h1 className="centerButton">Please connect with a wallet!!!!</h1></div>);
    }
	
	if (type === "forwardAuction"){
		try{
			const contr = new web3.eth.Contract(forwardAuctionBuild.abi, add);	
			return <ViewForwardAuction contractInstance={contr} selectedAccount={props.selectedAccount}/>

		}
		catch (e){
			console.log("Invalid address");
			return;
		}

	}
	else if (type === "backwardAuction"){
		try{
			const contr = new web3.eth.Contract(backwardAuctionBuild.abi, add);
			return <ViewBackwardAuction contractInstance={contr} selectedAccount={props.selectedAccount}/>

		}
		catch (e){
			console.log("Invalid address");
			return;
		}
	}
	else{
		console.log("Invalid  auction type");
		return;
	}	
	
};
export default ViewAuction;