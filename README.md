# Decentralised-Auction
This is a blockchain based e-Auction system  
For detailed explaination on how this works, watch <a href = https://youtu.be/6q05OFIF_uE>this</a> video.

## Dependencies 
1. Install Metamask for your browser
2. Install Node, npm, React
3. Install truffle/ganache

## How to run 
1. Set up metamask in browser
2. Set up a local blockchain.
### Local blockchain using truffle 
  In a new terminal, ```cd backend```  
  Run ```truffle develop``` . You will get a bunch of local accounts which can be added to metamask by entering their secret keys.  
  Run ```compile --reset``` inside truffle shell to compile smart contracts.<br>
*Note that you might need to change blockchain IP and address of account which is deploying the contract. One can find these in frontend/src/Web3Client.js*

3. ```cd frontend```
4. ```npm start```
5. Open browser console to see what is happening. Use *Highest Bid*  button to get highest bid information. Use given form to place a bid.
6. Switch accounts using metamask and try placing a **higher** bid.
  
## How to contribute
1. Clone the repo using ```git clone https://github.com/rhuthmos/Decentralised-Auction```
2. Make a new branch using ```git checkout -b <Branchname>```
3. Make your changes and commit regularly.
4. Push your branch using ```git push origin <Branchname>```
5. Create a pull request by clicking on the button in github repo. Add one among the repo contributors as code reviewer.
6. Code reviewer will review the code and suggest changes, and after the branch is ready to merge, it will be merged.
