import React, {useState} from "react";
import {Button, Grid} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

import IPFS from 'ipfs-api';


export const UploadUserDescription = (props) => {
	const ipfs = new IPFS({
        host: 'ipfs.infura.io',
        port: 5001, protocol: 'https'
    });
	const [buffer, setBuffer] = useState(false);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false)
    const [documentUploaded, setDocumentUploaded] = useState(false)

	const onChangeFile = e => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onloadend = async () => setBuffer(await Buffer.from(reader.result));
    };

	const submitDocument = async e => {
		setIsUploadingDocument(true);
		if (!buffer) {
            alert("Please select a file before start Uploading")
            setIsUploadingDocument(false)
            return
        }
		let ipfsHash = await ipfs.add(buffer);
		const url = "https://gateway.ipfs.io/ipfs/" + ipfsHash[0].hash;
		console.log("Uploaded at:", url)
		props.client.uploadUserDescription(url).then(
			msg => {
				console.log(msg)
				setDocumentUploaded(true);
				setIsUploadingDocument(false);
			}
		)
		.catch((err) => {
                setIsUploadingDocument(false)
                console.log(err);
                alert(err)
        });

	}
	if (isUploadingDocument) {
        return (<div id="homesec"><p className="centerButton"><CircularProgress size="60px" thickness={4}
                                                                                style={{color: "#007bff"}}/></p></div>);
    }
	return(
		<div id="homesec">
		{
			documentUploaded?
				<h1 className="centerButton">Document has been uploaded</h1>
			:
				
				<Grid container direction="column" alignItems="center" className="centerButton" >
					<Grid>
						UPLOAD USER DESCRIPTION
					</Grid>
					<Grid container
						style={{justifyContent: "center", width: "fit-content", transform: "translate(-15%)"}}>
						<Grid item xs={5}>
							<input type="file" onChange={onChangeFile}/>
						</Grid>
					</Grid>
					<Grid item margin={'10px'}>
						<Button variant="contained" onClick={submitDocument}>
							Upload Document
						</Button>
					</Grid>
				</Grid>
		}
		</div>
	)
};
// export default UploadUserDescription;
//0xE7B5f1120f8b79674CFc2ceE121443444E2F5Dc5