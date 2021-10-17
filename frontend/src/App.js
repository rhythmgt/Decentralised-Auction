import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import {init} from './Web3Client';
import { bid } from './Web3Client';
function App() {

	useEffect(() => {
		init();
	}, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
		<button onClick = {() => bid()}>Bid</button>
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
