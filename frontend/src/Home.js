import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom"
import {Button, Grid} from "@mui/material";
import axios from "axios";
import AuctionCard from "./AuctionCard";
import CircularProgress from "@mui/material/CircularProgress";

const Home = (props) => {
    const url = "http://127.0.0.1:5000/"
    const [ongoingAuctions, setOngoingAuctions] = useState(false);
    const [pastAuctions, setPastAuctions] = useState(false);

    const loadLiveAuction = () => {
        console.log("Loading Live Auctions")
        axios.get(url + 'get-ongoing-auctions'
        ).then((response) => {
            setOngoingAuctions(response.data.ongoingAuctions)
        }).catch((error) => {
            console.log("Error in loading live auctions", error);
        })
    }
    const loadPastAuction = () => {
        console.log("Loading Past Auctions")
        axios.get(url + 'get-past-auctions'
        ).then((response) => {
            setPastAuctions(response.data.pastAuctions)
        }).catch((error) => {
            console.log("Error in loading past auctions", error);
        })
    }
    useEffect(() => {
        console.log("Home useEffect called")
        loadLiveAuction();
        loadPastAuction();
        const liveAuctionInterval = setInterval(loadLiveAuction, 1000);
        const pastAuctionInterval = setInterval(loadPastAuction, 1000);
        return () => {
            console.log('Clearing Intervals');
            clearInterval(liveAuctionInterval);
            clearInterval(pastAuctionInterval);
        };
    }, [])
    return (
        <div id="homesec">
            <Grid container direction="column" alignItems="center">
                <Grid item id="btnsec">
                    <Button variant="contained" className="homeButton">
                        <Link to="/startauction">Start Auction</Link>
                    </Button>
                    <Button variant="contained" className="homeButton">
                        <Link to="/loadauction">Load Auction</Link>
                    </Button>
                </Grid>
                <Grid item id="btnsec" style={{width: "100%", padding: "2%"}}>
                    <Grid container display="flex"
                          justifyContent="center"
                          alignItems="center">
                        <h3 style={{
                            paddingBottom: "20px",
                            width: "100%",
                            textAlign: "center",
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>Live Auctions</h3>
                        <div>
                            <Grid container
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  style={{gap: 20}}>
                                {ongoingAuctions &&
                                ongoingAuctions.map((auction, index) => {
                                    return (
                                        <AuctionCard {...auction} key={index}/>
                                    );
                                })
                                }
                                {!ongoingAuctions &&
                                <div id="homesec"><p><CircularProgress size="40px"
                                                                       thickness={4}
                                                                       style={{color: "#007bff"}}/>
                                </p></div>
                                }
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
                <Grid item id="btnsec" style={{width: "100%", padding: "2%"}}>
                    <Grid container display="flex"
                          justifyContent="center"
                          alignItems="center">
                        <h3 style={{
                            paddingBottom: "20px",
                            width: "100%",
                            textAlign: "center",
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>Past Auctions</h3>
                        <div>
                            <Grid container
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  style={{gap: 20}}>
                                {pastAuctions &&
                                pastAuctions.map((auction, index) => {
                                    return (
                                        <AuctionCard {...auction} key={index}/>
                                    );
                                })
                                }
                                {!pastAuctions &&
                                <div id="homesec"><p><CircularProgress size="40px"
                                                                       thickness={4}
                                                                       style={{color: "#007bff"}}/>
                                </p></div>
                                }
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};
export default Home;
