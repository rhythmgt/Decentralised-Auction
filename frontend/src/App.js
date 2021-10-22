import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {useEffect, useState} from "react";
import {init} from './Web3Client';
import NavBar from "./NavBar";
import Home from "./Home";
import StartAuction from "./StartAuction";
import ViewAuction from "./ViewAuction";

function App() {
    // const [login, setLogin] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(false);


    return (
        <Router>
            <NavBar selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount}/>
            <div className="content">
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route exact path="/startauction">
                        <StartAuction selectedAccount={selectedAccount}/>
                    </Route>
                    <Route exact path="/viewauction">
                        <ViewAuction/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
