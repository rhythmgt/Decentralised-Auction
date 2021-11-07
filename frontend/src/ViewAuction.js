import React from "react";
import {useParams} from "react-router-dom";


const ViewAuction = (props) => {
    const {add, type} = useParams();
    return (
        <div id="homesec">
            <p className="centerButton">View Auction <br/> {add} -------- {type}</p>
        </div>
    )
};
export default ViewAuction;
