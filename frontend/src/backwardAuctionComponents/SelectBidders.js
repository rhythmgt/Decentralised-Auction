import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {Checkbox} from '@mui/material';
import SelectBidderTable from "./SelectBidderTable";

export const SelectBidders = (props) => {
    const [rowData, setRowData] = useState([])
    useEffect(() => {
        props.client.getPreBidParticipants().then(
            async participants => {
                const promises = new Array(participants.length);
                for (let i = 0; i < participants.length; i++) {
                    promises[i] = props.client.getDescriptions(participants[i])
                }
                const desc = await Promise.all(promises)
                let tableData = []
                // console.log(participants)
                // console.log(desc)
                for (let i = 0; i < participants.length; i++) {
                    tableData = [...tableData, {
                        "id": participants[i],
                        "accountAddress": participants[i],
                        "documentLink": desc[i]
                    }]
                }
                setRowData(tableData)

            }
        )
    }, []);
    // console.log("Here in Select Bidders")
    return (
        <div id="homesec">
            <Grid container direction="column" alignItems="center" className="centerButton">
                <SelectBidderTable row={rowData} client={props.client}/>
            </Grid>
        </div>
    )
}