const CErc20Delegate = artifacts.require('CErc20Delegate');
const CErc20Delegator = artifacts.require('CErc20Delegator');
const BUSDTest = artifacts.require('BUSDTest');
const WBGLTest = artifacts.require('WBGLTest');
const JumpRateModelV2 = artifacts.require('JumpRateModelV2');
const Unitroller = artifacts.require('Unitroller');
const Comptroller = artifacts.require('Comptroller');

module.exports = async function (deployer, network, accounts) {
  let owneraddr = "";

  if (network == "live" || network == "live-fork") {
    throw("not supported");
  } else if (network == "bsc" || network == "bsc-fork") {
    owneraddr = "";
  } else {
    owneraddr = accounts[0];
  }

  if (owneraddr == '') {
    throw("ERROR: owner address");
  }

  //let comptrollerInstance = (await Unitroller.deployed());
  let comptrollerInstance = (await Comptroller.at((await Unitroller.deployed()).address)); // treat Unitroller as Comptroller
  await comptrollerInstance._setLiquidationIncentive(web3.utils.toBN("50000000000000000")); // 5% liquidation incentive?

  //await comptrollerInstance._setOriginationFee(web3.utils.toBN("0")); // 0% rewards to protocol
  //await comptrollerInstance._setOriginationFee(web3.utils.toBN("1500000000000000000"), web3.utils.toBN("50000000000000000")); // 150% collateral req, 5% liquidation discount
};
