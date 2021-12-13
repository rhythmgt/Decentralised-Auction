import React, {useEffect, useState} from "react";
import {Button, Grid} from "@mui/material";
import TextField from '@mui/material/TextField';
import { backwardAuctionClient } from "./backwardAuctionClient";
import {UploadUserDescription} from "./backwardAuctionComponents/UploadUserDescription"
import { SelectBidders } from "./backwardAuctionComponents/SelectBidders";
import { UserBid } from "./backwardAuctionComponents/UserBid";
import CircularProgress from '@mui/material/CircularProgress';

const ViewBackwardAuction = (props) => {

	const [lowestBid, setLowestBid] = useState(0);
	const [bidVal, setBidVal] = useState(0);
	const [documentLink, setDocumentLink] = useState(null);
	const [auctionPhase, setAuctionPhase] = useState(0);
	const [isBuyer, setIsBuyer] = useState(false);
    const [isLoadingVBA, setIsLoadingVBA] = useState(true)

	const client = new backwardAuctionClient(props.contractInstance, props.selectedAccount);
	const bid = (e) =>{
		console.log("Bidding from view auction", bidVal)
		client.bid(bidVal).then(
			tx=> {console.log(tx);
			return client.getLowestBid()}
		)		
		.then(
			lb => setLowestBid(lb)
		)
		.catch((err) => 
		console.log(err))
	}


	const endAuction = (e) => {
		client.auctionEnd().then(
			tx=>{
				console.log(tx);
				return client.getAuctionPhase()
			}
		)
		.then(
			phase=>{
				console.log("Phase:", phase);
				setAuctionPhase(phase)}
		)
	}

 	props.contractInstance.methods.auctionEndTime().call({from: props.selectedAccount}).then((tx) => {
		console.log("Auction End time:", tx);
	})
		.catch((err) => {
			console.log(err);
	});

	useEffect(()=>{
		// client.getLowestBid().then(
		// 	lb => setLowestBid(lb)
		// )

		// client.getDocumentLink().then(
		// 	dl=> setDocumentLink(dl)
		// )
		// client.getBuyer().then(
		// 	buyer=>{
		// 		console.log("buyer", buyer, props.selectedAccount);
		// 		setIsBuyer(props.selectedAccount.toLowerCase()===buyer.toLowerCase());
		// 	}
		// )
		// client.getAuctionPhase().then(
		// 	phase=>{
		// 		console.log("Phase:", phase);
		// 		setAuctionPhase(phase)}
		// )
		// client.getPreBidParticipants().then(participants =>{
		// 	console.log("Participants :", participants)
		// })
		client.getLowestBid().then(
			lb => {
				setLowestBid(lb)
				return client.getDocumentLink()
			}
		)
		.then(
			dl=> {
				setDocumentLink(dl)
				return client.getBuyer()
			}
		)
		.then(
			buyer=>{
				console.log("buyer", buyer, props.selectedAccount);
				setIsBuyer(props.selectedAccount.toLowerCase()===buyer.toLowerCase());
				return client.getAuctionPhase()
			}
		)
		.then(
			phase=>{
				console.log("Phase:", phase);
				setAuctionPhase(phase)
				return client.getPreBidParticipants()
			}
		)
		.then(participants =>{
			console.log("Participants :", participants)
			setIsLoadingVBA(false)
		})
	}, []);
	
	if (isLoadingVBA) {
        return (<div id="homesec"><p className="centerButton"><CircularProgress size="60px" thickness={4}
                                                                                style={{color: "#007bff"}}/></p></div>);
    }

	if (auctionPhase===2){
		return (<h1 className="centerButton">Auction has Ended</h1>)
	}

	if (auctionPhase<1){
		if (isBuyer){
			return <SelectBidders client= {client}/>
		}
		console.log("Document uploader", auctionPhase)
		return <UploadUserDescription client={client}/>
	}
	else{
		console.log("Bidder", auctionPhase)
		return (
			<div id="homesec">
				<Grid container direction="column" alignItems="center" className="centerButton" >
					<Grid item margin={'10px'}>
						Current Lowest Bid : {lowestBid} <br/>
					</Grid>
					<Grid>
						Product Description Document : <a href = {documentLink}>Link</a>
					</Grid>
					<Grid>
						{isBuyer?
							<Button variant="contained" onClick= {(e)=>{endAuction(e)}}>
								End Auction
							</Button>
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
		)	
	}
    
    
};
export default ViewBackwardAuction;