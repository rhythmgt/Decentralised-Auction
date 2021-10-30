import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom"
import {Button, ButtonGroup, Grid} from "@mui/material";

const Home = (props) => {
    return (
        <div id="homesec">
            <Grid container direction="column" alignItems="center" className="centerButton">
                <Grid item id="btnsec">
                    <Button variant="contained" className="homeButton">
                        <Link to="/startauction">Start Auction</Link>
                    </Button>
                    <Button variant="contained" className="homeButton">
                        <Link to="/viewauction">View Auction</Link>
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};
export default Home;
