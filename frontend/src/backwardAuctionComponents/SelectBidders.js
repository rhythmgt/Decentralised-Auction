import React, {useEffect, useState} from "react";
import {Button, Grid} from "@mui/material";
import { Checkbox } from '@mui/material';

export  const SelectBidders = (props) =>{

	const [userDescDocs, setUserDescDocs] = useState(null)

	const handleSubmission = (e) =>{
		// Submit selected addresses to preBidFilter function of contract via preBidFilter of backwardAuctionClient

	}

	useEffect(() => {
		props.client.getUserDescDocs()
		.then(
			descDocs => {
				var promises = new Array(descDocs.length) 
				for (var i =0; i<descDocs.length; i++){
					promises[i] = props.client.getDescriptions(descDocs[i])
				}
				return Promise.all(promises)
				}
		)
		.then(
			desc => setUserDescDocs(desc)
		)
        
    }, []);

	return (
		<div id="homesec">
			{userDescDocs && <Grid container direction="column" alignItems="center" className="centerButton" >
				{
					userDescDocs.map( (pair, i) => 
					{
						return <Grid>
							<a href={pair}>Link</a>
							<Checkbox />
						</Grid>
					
					})
				}
			
			</Grid>}
			<Button variant="contained" onClick={handleSubmission}>
                    Start Bidding
            </Button>
		</div>
	)
}