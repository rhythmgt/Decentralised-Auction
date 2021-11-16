import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {useState} from "react";
import NavBar from "./NavBar";
import Home from "./Home";
import StartAuction from "./StartAuction";
// import ViewAuction from "./ViewAuction";
import LoadAuction from "./LoadAuction";

function App() {
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
                    {/* <Route exact path="/viewauction/:add/:type">
                        <ViewAuction/>
                    </Route> */}
                    <Route exact path="/loadauction">
                        <LoadAuction selectedAccount={selectedAccount}/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
