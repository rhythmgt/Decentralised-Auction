import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import {init} from './Web3Client';
import { bid, getHighestBid } from './Web3Client';
function App() {

	useEffect(() => {
		init();
	}, []);

	var bidVal = 10;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
		<form onSubmit={(e)=>bid(bidVal)}>
			<label>
				Value:
				<input type="number"  onChange={(e)=>{bidVal = e.target.value}}/>
			</label>
			<input type="submit" value="Submit" />
		</form>
		<button onClick = {() => getHighestBid()}>Highest Bid</button>
		
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
	  
    </div>
  );
}

export default App;
