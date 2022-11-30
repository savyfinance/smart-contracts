const Comptroller = artifacts.require('Comptroller');
const Unitroller = artifacts.require('Unitroller');
const GatedPriceOracle = artifacts.require('GatedPriceOracle');

module.exports = async function (deployer, network, accounts) {
  let owneraddr = "";
  if (network == "live" || network == "live-fork") {
    throw("not supported");
  } else if (network == "bsc" || network == "bsc-fork") {
    owneraddr = "";

    await Promise.all([
      deployer.deploy(GatedPriceOracle, {from: owneraddr}),
    ]);
  } else if (network == "bsctest" || network == "bsctest-fork") {
    owneraddr = "";

    // deploy simple oracle for tests
    await Promise.all([
      deployer.deploy(GatedPriceOracle, {from: owneraddr}),
    ]);
  } else {
    owneraddr = accounts[0];

    // deploy simple oracle for tests
    await Promise.all([
      deployer.deploy(GatedPriceOracle, {from: owneraddr}),
    ]);
  }

  if (owneraddr == '') {
    throw("ERROR: owner address");
  }

  await Promise.all([
    deployer.deploy(Unitroller, {from: owneraddr}),
  ]);

  // attach implementation to Unitroller
  let comptrollerInstance = (await Comptroller.deployed());
  let unitrollerInstance = (await Unitroller.deployed());
  
  await unitrollerInstance._setPendingImplementation(comptrollerInstance.address);
  await comptrollerInstance._become(unitrollerInstance.address);
  // after this point we treat Unitroller as Comptroller
  
  let comptrollerProxyInstance = (await Comptroller.at((await Unitroller.deployed()).address)); // treat Unitroller as Comptroller

  // attach oracle
  let oracleInstance = (await GatedPriceOracle.deployed());
  await comptrollerProxyInstance._setPriceOracle(oracleInstance.address);

  console.log(`Oracle address: ${oracleInstance.address}`);
  console.log(`Comptroller implementation address: ${comptrollerInstance.address}`);
  console.log(`Comptroller (Unitroller) deployed address: ${unitrollerInstance.address}`);
};
