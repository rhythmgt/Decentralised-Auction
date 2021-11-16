import React, {useEffect, useState} from "react";
import {Button, Grid} from "@mui/material";
import TextField from '@mui/material/TextField';
import { forwardAuctionClient } from "./forwardAuctionClient";

// essential auction info
//  bid
// increment  bid
// withdraw bid

const ViewForwardAuction = (props) => {

	const [highestBid, setHighestBid] = useState(0);
	const [previousBid, setPreviousBid] = useState(0);
	const [bidVal, setBidVal] = useState(0);
	const [bidIncrementVal, setBidIncrementVal] = useState(0);
	const [documentLink, setDocumentLink] = useState(null);
	const [isSeller, setIsSeller] = useState(false);
	const client = new forwardAuctionClient(props.contractInstance, props.selectedAccount);
	const bid = (e) =>{
		console.log("Bidding from view auction", bidVal)
		client.bid(bidVal).then(
			tx=> {console.log(tx);
			return client.getHighestBid()}
		)		
		.then(
			hb => {setHighestBid(hb);
				return client.getPreviousBid();}

		)
		.then(
			pb=> setPreviousBid(pb)
		)
		.catch((err) => 
		console.log(err))
	}
	const incrementBid = (e) =>{
		client.incrementBid(bidIncrementVal).then(
			tx=> {console.log(tx);
			return client.getHighestBid()}
		)		
		.then(
			hb => {setHighestBid(hb);
				return client.getPreviousBid();}
		)
		.then(
			pb=> setPreviousBid(pb)
		)
		.catch((err) => 
			console.log(err))
	}

	const withdrawBid = (e) => {
		client.withdrawBid().then(
			tx=> 
			{console.log(tx);
			return client.getHighestBid()}
		)
		.then(
			hb => {setHighestBid(hb);
			return	client.getPreviousBid()}
		)
		.then(
			pb=> setPreviousBid(pb)
		)
		.catch(
			err => console.log(err)
		)
	}

	const endAuction = (e) => {
		console.log("Mai khatam kardunga")
	}

 	props.contractInstance.methods.auctionEndTime().call({from: props.selectedAccount}).then((tx) => {
		console.log("Auction End time:", tx);
	})
		.catch((err) => {
			console.log(err);
	});

	useEffect(()=>{
		client.getHighestBid().then(
			hb => setHighestBid(hb)
		)
		client.getPreviousBid().then(
			pb=> setPreviousBid(pb)
		)
		client.getDocumentLink().then(
			dl=> setDocumentLink(dl)
		)
		client.getSeller().then(
			seller=>{
				console.log("seller", seller, props.selectedAccount);
				setIsSeller(props.selectedAccount.toLowerCase()===seller.toLowerCase());
			}
		)
	}, []);
	
    return (
        <div id="homesec">
			<Grid container direction="column" alignItems="center" className="centerButton" >
				<Grid item margin={'10px'}>
					Current Highest Bid : {highestBid} <br/>
					Previous Bid : {previousBid}	
				</Grid>
				<Grid>
					Product Description Document : <a href = {documentLink}>Link</a>
				</Grid>
				<Grid>
					{isSeller?
						<Button variant="contained" onClick= {(e)=>{endAuction(e)}}>
							End Auction
						</Button>
						:
					previousBid>0?
						<Grid container direction="column" alignItems="center">
							<Grid  container direction="row" alignItems="center">
								<Grid item margin={'10px'}>
									<TextField id="bidIncrVal" label="Bid Increment Value" type = "number" variant="outlined"
										onChange= {(e) => {setBidIncrementVal(e.target.value)}}   />
								</Grid>
								<Grid item margin={'10px'}>
									<Button variant="contained" onClick= {(e)=>{incrementBid(e)}}>
										Increment Bid
									</Button>
								</Grid>
							</Grid> 
							<Grid>
								<Button variant="contained" onClick= {(e)=>{withdrawBid(e)}}>
									Withdraw Bid
								</Button>
							</Grid>
						</Grid>
						:
						<Grid  container direction="row" alignItems="center">
								<Grid item margin={'10px'}>
									<TextField id="bidVal" label="Bid Value" type = "number" variant="outlined"
										onChange= {(e) => {setBidVal(e.target.value)}}   />
								</Grid>
								<Grid item margin={'10px'}>
									<Button variant="contained" onClick= {(e)=>{bid(e)}}>
										Bid
									</Button>
								</Grid>
						</Grid>				
					}
				</Grid>
			</Grid>
        </div>
    );
};
export default ViewForwardAuction;
