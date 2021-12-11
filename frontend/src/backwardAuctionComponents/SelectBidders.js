import React, {useEffect, useState} from "react";
import {Button, Grid} from "@mui/material";

export  const SelectBidders = (props) =>{

	const [userDescDocs, setUserDescDocs] = useState(null)
	useEffect(() => {
		props.client.getUserDescDocs()
		.then(
			descDocs => {
				console.log("Desc docs", descDocs)
				setUserDescDocs(descDocs)}
		)
        
    }, []);

	return (
		<div id="homesec">
			{userDescDocs && <Grid container direction="column" alignItems="center" className="centerButton" >
				{
					userDescDocs.map( (pair, i) => {return <Grid>{pair}</Grid>})
				}
			
			</Grid>}
		</div>
	)
}