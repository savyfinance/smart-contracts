const JumpRateModelV2 = artifacts.require('JumpRateModelV2');
//const WhitePaperInterestRateModel = artifacts.require('WhitePaperInterestRateModel');

module.exports = async function (deployer, network, accounts) {
  let owneraddr = "";
  if (network == "live" || network == "live-fork") {
    throw("not supported");
  } else if (network == "bsc" || network == "bsc-fork") {
    owneraddr = "";
  } else if (network == "bsctest" || network == "bsctest-fork") {
    owneraddr = "";
  } else {
    owneraddr = accounts[0];
  }

  if (owneraddr == '') {
    throw("ERROR: owner address");
  }

  // taken from https://etherscan.io/address/0xFB564da37B41b2F6B6EDcc3e56FbF523bD9F2012#code
  // USDT IRM params
  await Promise.all([
    deployer.deploy(JumpRateModelV2, web3.utils.toBN("0"), web3.utils.toBN("40000000000000000"), 
          web3.utils.toBN("1090000000000000000"), web3.utils.toBN("800000000000000000"), owneraddr, {from: owneraddr}),
  ]);

  //from cUSDC 0x39AA39c021dfbaE8faC545936693aC917d5E7563
  //await Promise.all([
  //  deployer.deploy(WhitePaperInterestRateModel, web3.utils.toBN("0"), web3.utils.toBN("200000000000000000"), {from: owneraddr}),
  //]);
};
