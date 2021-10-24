import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { init, bid, getHighestBid,  incrementBid, withdrawBid, getPendingReturns, auctionEnd } from './Web3Client';
function App() {

	useEffect(() => {
		init();
	}, []);

	var bidVal = 0;
	var incrBidVal = 0;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
		<form onSubmit={
			(e)=>{
			e.preventDefault();
			bid(bidVal);} }>
			<label>
				Value:
				<input type="number"  onChange={(e)=>{bidVal = e.target.value}}/>
			</label>
			<input type="submit" value="Bid" />
		</form>
		<form onSubmit={
			(e)=>{
			e.preventDefault();
			incrementBid(incrBidVal);} }>
			<label>
				Value:
				<input type="number"  onChange={(e)=>{incrBidVal = e.target.value}}/>
			</label>
			<input type="submit" value="Increment Bid" />
		</form>
		
		<button onClick = {() => getHighestBid()}>Highest Bid</button>
		<button onClick = {() => withdrawBid()}>Withdraw Bid</button>
		<button onClick = {() => getPendingReturns()}>Pending Returns</button>
		<button onClick = {() => auctionEnd()}>End Auction</button>
		
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
