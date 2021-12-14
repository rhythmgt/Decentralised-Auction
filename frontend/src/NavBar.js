import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useState} from "react";
import {Link} from "react-router-dom";

const NavBar = (props) => {
    const [connectText, setConnectText] = useState("Connect with Wallet")
    const accountSelected = e => {
        console.log(e)
    }
    const connectWallet = e => {
        setConnectText("Connecting wallet...")
        let provider = window.ethereum;
        if (typeof provider !== 'undefined') {

            provider.request({method: 'eth_requestAccounts'}).then(
                (accounts) => {
                    props.setSelectedAccount(accounts[0]);
                    console.log('Selected account is : ' + props.selectedAccount);
                }
            ).catch(
                (err) => {
                    console.log(err);
                    return;
                }
            );
            window.ethereum.on('accountsChanged', (accounts) => {
                props.setSelectedAccount(accounts[0]);
                console.log('Selected account is : ' + props.selectedAccount);
            })
        } else {
            console.log("This will work only with modern browsers and Metamask installed");
            return;
        }
    }
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar style={{backgroundColor: "black"}}>
                <Toolbar style={{marginTop: "10px", marginBottom: "10px"}}>
                    <Typography variant="h4" component="div" sx={{flexGrow: 1}} id="btnsec">
                        <Link to="/">Decentralized Auction</Link>
                    </Typography>
                    {!props.selectedAccount &&
                    <Button variant="contained" onClick={connectWallet}>{connectText}</Button>}
                    {props.selectedAccount &&
                    <Chip
                        onClick={accountSelected}
                        label={props.selectedAccount.slice(0,7)+"...."+props.selectedAccount.slice(-7)}
                        title={props.selectedAccount}
                        color="primary"
                        style={{fontSize:"0.875rem", padding:"6px 16px"}}
                    />
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );


};
export default NavBar;
