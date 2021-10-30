import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom"
import {Button, ButtonGroup, Grid} from "@mui/material";
import IPFS from 'ipfs-api';

const IpfsConnect = (props) => {
    // const IPFS = require('ipfs-api');
    const ipfs = new IPFS({
        host: 'ipfs.infura.io',
        port: 5001, protocol: 'https'
    });

    // console.log(ipfs)

    const [file, setFile] = useState('');
    const [buffer, setBuffer] = useState('');
    const [filename, setFilename] = useState('Upload your code file here');
    const [featurename, setFeaturename] = useState('Upload your code file here');

    const onChangeName = e => {
        setFeaturename(e.target.value)
    };

    const onChangeFile = e => {
        setFile(e.target.files[0]);
        console.log(e.target.files[0]);
        setFilename(e.target.files[0].name);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onloadend = () => convertToBuffer(reader);
    };

    const convertToBuffer = async (reader) => {
        const buffer = await Buffer.from(reader.result);
        setBuffer(buffer)
    };

    const onSubmit = async e => {
        e.preventDefault();
        console.log(buffer);
        await ipfs.add(buffer, (err, ipfsHash) => {
            console.log(ipfsHash[0].hash);
        })
    }

    return (
        <form className="form-container" style={{margin: "20%"}} onSubmit={onSubmit}>
            <div className="input-group mb-3">
                <div className="custom-file" style={{width: "10%"}}>
                    <input
                        type="file"
                        className="custom-file-input"
                        required
                        onChange={onChangeFile}
                        style={{width: "10%"}}
                    />
                    <label
                        className="custom-file-label"
                        aria-describedby="inputGroupFileAddon02"
                        style={{width: "30rem"}}>
                        {filename}
                    </label>
                </div>
            </div>
            <button type="submit" value="submit" className="btn btn-primary">
                Send it
            </button>
        </form>


    );
};
export default IpfsConnect;
