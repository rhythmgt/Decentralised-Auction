import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Button, Checkbox} from '@mui/material';
import {useState} from "react";


function createLink(params) {
    return <a href={params.row.documentLink} target={"_blank"}>Document Link</a>
}

function displayAddress(params) {
    return <p>{params.row.accountAddress.slice(0, 30) + "...." + params.row.accountAddress.slice(-30)}</p>
}


function idColumn(params, updater) {
    return <Checkbox
        onChange={e => updater(params.row.accountAddress, e.target.checked)}
    />
}

const columns = (updater) => {
    return [
        {
            field: 'id',
            type: 'number',
            headerName: 'Select',
            headerAlign: 'left',
            align: 'left',
            headerClassName: 'super-app-theme--header',
            label: 'NAME',
            flex: 0.05,
            renderCell: (params) => {
                return idColumn(params, updater)
            },
        },
        {
            field: 'Account Address',
            headerName: 'Account Address',
            headerClassName: 'super-app-theme--header',
            renderCell: displayAddress,
            flex: 0.80
        },
        {
            field: 'Document Link',
            headerName: 'Document Link',
            headerClassName: 'super-app-theme--header',
            renderCell: createLink,
            flex: 0.15
        }
    ]
}

export default function SelectBidderTable(props) {
    const [sellerState, setSellerState] = useState({})
    function handleSubmission() {
        let selectedSeller = []
        for (const [key, value] of Object.entries(sellerState)) {
            if (value) {
                selectedSeller.push(key)
            }
        }
        console.log(selectedSeller)
        props.client.preBidFilter(selectedSeller).then((result) => {console.log(result)})
    }
    function updater(seller, checked) {
        let tempState = sellerState
        tempState[seller] = checked
        setSellerState(tempState)
    }

    return (
        <div style={{height: 400, width: '50%'}}>
            <DataGrid
                rows={props.row}
                columns={columns(updater)}
            />
            <Button variant="contained" onClick={handleSubmission}>
                Start Bidding
            </Button>
        </div>
    );
}
