const Comptroller = artifacts.require('Comptroller');
 
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

  await Promise.all([
    deployer.deploy(Comptroller, {from: owneraddr}),
  ]);
};
