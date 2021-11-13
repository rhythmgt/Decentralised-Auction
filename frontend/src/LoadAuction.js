import React, {useEffect, useState} from "react";
import {Button, Grid} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import forwardAuctionBuild from 'contracts/forwardAuction.json';
import backwardAuctionBuild from 'contracts/backwardAuction.json';
import Web3 from 'web3';
import ViewAuction from "./ViewAuction";

const LoadAuction = (props) => {
	const [auctionType, setAuctionType] = useState(null);
	const [contractAddress, setContractAddress] = useState("");
	const [auctionLoaded, setAuctionLoaded] = useState(false);
	const [contractInstance, setContractInstance] = useState(null);
	
	const auctionChange = e => {
        setAuctionType(e.target.value);
    }
	const addressChange = e => {
        setContractAddress(e.target.value);
    }
	const handleSubmission = e =>{
		var jsonFile = null;
		const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
		if (auctionType === "forward"){
			jsonFile = forwardAuctionBuild;
		}
		else if (auctionType === "backward"){
			jsonFile = backwardAuctionBuild;
		}
		else{
			console.log("Invalid  auction type");
			return;
		}
		setContractInstance(new web3.eth.Contract(jsonFile.abi, contractAddress));
		// contractInstance.methods.auctionEndTime().call({from: props.selectedAccount}).then((tx) => {
		// 	console.log("Auction End time:", tx);
		// })
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
		setAuctionLoaded(true);
	}
	if (auctionLoaded){
		return <ViewAuction contractInstance={contractInstance}/>
	}
    return (
        <div id="homesec">
            <p className="centerButton">Load Auction</p>
			<Grid container direction="column" alignItems="center" className="centerButton">
                <Grid item margin={'10px'}>
                    <FormControl>
                        <FormLabel>Auction type</FormLabel>
                        <RadioGroup row>
                            <FormControlLabel value="forward" control={<Radio/>} label="Sell" onChange={auctionChange}/>
                            <FormControlLabel value="backward" control={<Radio/>} label="Buy" onChange={auctionChange}/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
				{
					auctionType!=null &&
					<Grid container direction="column" alignItems="center">
						<TextField id="contractAddress" label="contractAddress" variant="outlined"
                                   onChange={addressChange}/>
						<Button variant="contained" onClick={handleSubmission}>
                            Submit
                        </Button>
					</Grid>	
				}                
            </Grid>
        </div>
    );
};
export default LoadAuction;
