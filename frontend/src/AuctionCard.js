import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CardActionArea} from '@mui/material';
import {useHistory} from "react-router-dom"
function timeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = "0" + a.getDate();
    const hour = "0" + a.getHours();
    const min = "0" + a.getMinutes();
    const sec = "0" + a.getSeconds();
    const time = month + " " +date.substr(-2) + ',' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
    return time;
}

const AuctionCard = (props) => {
    const hist = useHistory();
    const time = timeConverter(props.end_time)
    const handleClick = () => {
        hist.push("/viewauction/"+props._id+"/"+props.contract_name);
    }
    return (
        <Card sx={{maxWidth: 380}} onClick={handleClick}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        Type : {props.contract_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        End Time : {time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Address : {props._id}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
export default AuctionCard;
