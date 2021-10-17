const MyContract = artifacts.require("forwardAuction");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  await deployer.deploy(MyContract, 10, "0x580a30e798b815f869867f67e8389ae118a6e774", 10, 2, false
	);
};