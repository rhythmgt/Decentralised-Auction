import React, {useEffect, useState} from "react";
import {Button, Grid} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Web3 from 'web3';


// value bid
// increment decrement bid
// withdraw bid

const ViewAuction = (props) => {

	props.contractInstance.methods.auctionEndTime().call({from: props.selectedAccount}).then((tx) => {
		console.log("Auction End time:", tx);
	})
		.catch((err) => {
			console.log(err);
	});

    return (
        <div id="homesec">
            <p className="centerButton">View Auction</p>
			<Grid container direction="row" alignItems="center">
						<TextField id="contractAddress" label="contractAddress" variant="outlined"
                                   />
						<Button variant="contained" >
                            Submit
                        </Button>
					</Grid>
        </div>
    );
};
export default ViewAuction;
