const MyContract = artifacts.require("SimpleAuction");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  await deployer.deploy(MyContract, 10, "0x580a30e798B815f869867f67E8389ae118A6E774"
	);
};