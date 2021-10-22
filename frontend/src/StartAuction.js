import React, {useEffect, useState} from "react";
import Web3 from 'web3';
import forwardAuctionBuild from 'contracts/forwardAuction.json';
import backwardAuctionBuild from 'contracts/backwardAuction.json';
import {Link, useHistory} from "react-router-dom"
import {Button, ButtonGroup, Grid} from "@mui/material";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';


const StartAuction = (props) => {
    const [isCreatingAuction, setIsCreatingAuction] = useState(false)
    const [account, setAccount] = useState(false)
    const [auctionCreated, setAuctionCreated] = useState(false)
    const [auctionType, setAuctionType] = useState(null);
    const [auctionAddress, setAuctionAddress] = useState(null);
    const [auctionParameters, setAuctionParameter] = useState({})
    const handleFormChange = e => {
        auctionParameters[e.target.id] = e.target.value
        setAuctionParameter({...auctionParameters})
    }
    const createAuction = async e => {
        console.log(auctionParameters)
        let promise;
        setIsCreatingAuction(true);
        if (auctionType === "forward") {
            promise = createForwardAuction(props.selectedAccount, auctionParameters)
        } else if (auctionType === "backward") {
            promise = createBackwardAuction(props.selectedAccount, auctionParameters)
        }
        promise.then(function (newContractInstance) {
            setAuctionCreated(true)
            setAuctionAddress(newContractInstance.options.address)
            console.log(newContractInstance)
            setIsCreatingAuction(false)
        })
            .catch((err) => {
                setIsCreatingAuction(false)
                console.log(err);
                alert(err)
            });


    }
    const auctionChange = e => {
        setAuctionType(e.target.value)
        if (e.target.value === "forward") {
            setAuctionParameter({
                "biddingPeriod": 1000,
                "sellerAddress": props.selectedAccount,
                "minBid": 0,
                "minIncrement": 0,
                "allowWithdraw": "true"
            })
        } else if (e.target.value === "backward") {
            setAuctionParameter({
                "biddingPeriod": 1000,
                "buyerAddress": props.selectedAccount,
                "maxBid": 50,
                "minDecrement": 0,
            })
        }
    }
    useEffect(() => {
        setAccount(props.selectedAccount)
    }, [props.selectedAccount]);
    if (props.selectedAccount === false) {
        return (<div id="homesec">
            <p className="centerButton"><h1>Please connect with a wallet!!!!</h1></p>
        </div>);
    }
    if (isCreatingAuction) {
        return (<div id="homesec"><p className="centerButton"><CircularProgress size="60px" thickness={4}
                                                                                style={{color: "#007bff"}}/></p></div>);
    }
    console.log(props.selectedAccount)
    return (
        <div id="homesec">
            {auctionCreated && <p className="centerButton">Auction created. Address - {auctionAddress}</p>}
            {!auctionCreated &&
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
                {auctionType === 'forward' &&
                <Grid container direction="column" alignItems="center">
                    <Grid item margin={'10px'}>
                        <TextField id="biddingPeriod" label="biddingPeriod" type="number" variant="outlined"
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <TextField id="sellerAddress" label="sellerAddress" variant="outlined" value={account}
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <TextField id="minBid" label="minBid" variant="outlined" type="number"
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <TextField id="minIncrement" label="minIncrement" type="number" variant="outlined"
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <TextField id="allowWithdraw" label="allowWithdraw" variant="outlined"
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <Button variant="contained" onClick={createAuction}>
                            Create Auction
                        </Button>
                    </Grid>
                </Grid>
                }
                {auctionType === 'backward' &&
                <Grid container direction="column" alignItems="center">
                    <Grid item margin={'10px'}>
                        <TextField id="biddingPeriod" label="biddingPeriod" type="number" variant="outlined"
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <TextField id="buyerAddress" label="buyerAddress" variant="outlined" value={account}
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <TextField id="maxBid" label="maxBid" variant="outlined" type="number"
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <TextField id="minDecrement" label="minDecrement" type="number" variant="outlined"
                                   onChange={handleFormChange}/>
                    </Grid>
                    <Grid item margin={'10px'}>
                        <Button variant="contained" onClick={createAuction}>
                            Create Auction
                        </Button>
                    </Grid>
                </Grid>
                }
            </Grid>
            }
        </div>
    );
};
export default StartAuction;


const createForwardAuction = (selectedAccount, parameters) => {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    let forwardAuctionContract = new web3.eth.Contract(forwardAuctionBuild.abi);
    forwardAuctionContract.options.data = forwardAuctionBuild.bytecode;
    let allowWithdraw = true
    if (parameters.allowWithdraw === "false") {
        allowWithdraw = false
    }
    return forwardAuctionContract.deploy({
        arguments: [parseInt(parameters.biddingPeriod),
            parameters.sellerAddress,
            parseInt(parameters.minBid),
            parseInt(parameters.minIncrement),
            allowWithdraw]
    })
        .send({
            from: selectedAccount,
            gas: 6721975,
            gasPrice: '2'
        })

}


const createBackwardAuction = async (selectedAccount, parameters) => {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    let backwardAuctionContract = new web3.eth.Contract(backwardAuctionBuild.abi);
    backwardAuctionContract.options.data = backwardAuctionBuild.bytecode;
    await backwardAuctionContract.deploy({
        arguments: [parseInt(parameters.biddingPeriod),
            parameters.buyerAddress,
            parseInt(parameters.maxBid),
            parseInt(parameters.minDecrement)]
    })
        .send({
            from: selectedAccount,
            gas: 6721975,
            gasPrice: '2',
            value: 5
        })
}