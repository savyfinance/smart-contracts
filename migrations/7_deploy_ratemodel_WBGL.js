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

  // taken from https://etherscan.io/address/0xccf4429db6322d5c611ee964527d42e5d685dd6a
  // WBTCv2 COMP IRM params
  await Promise.all([
    deployer.deploy(JumpRateModelV2, web3.utils.toBN("20000000000000000"), web3.utils.toBN("180000000000000000"), 
          web3.utils.toBN("1000000000000000000"), web3.utils.toBN("800000000000000000"), owneraddr, {from: owneraddr}),
  ]);

  //from cWBTC 0xC11b1268C1A384e55C48c2391d8d480264A3A7F4
  //await Promise.all([
  //  deployer.deploy(WhitePaperInterestRateModel, web3.utils.toBN("20000000000000000"), web3.utils.toBN("300000000000000000"), {from: owneraddr}),
  //]);
};
