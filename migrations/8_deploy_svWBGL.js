const CErc20Delegate = artifacts.require('CErc20Delegate');
const CErc20Delegator = artifacts.require('CErc20Delegator');
const WBGLTest = artifacts.require('WBGLTest');
const JumpRateModelV2 = artifacts.require('JumpRateModelV2');
const Unitroller = artifacts.require('Unitroller');
const Comptroller = artifacts.require('Comptroller');

module.exports = async function (deployer, network, accounts) {
  let owneraddr = "";
  let WBGLaddr = "";

  if (network == "live" || network == "live-fork") {
    throw("not supported");
  } else if (network == "bsc" || network == "bsc-fork") {
    owneraddr = "";
    WBGLaddr = "0x2bA64EFB7A4Ec8983E22A49c81fa216AC33f383A";
  } else if (network == "bsctest" || network == "bsctest-fork") {
    owneraddr = "";
    await Promise.all([
      deployer.deploy(WBGLTest, owneraddr, {from: owneraddr})
    ]);
    let WBGLInstance = (await WBGLTest.deployed());
    WBGLaddr = WBGLInstance.address;
  } else {
    owneraddr = accounts[0];
    await Promise.all([
      deployer.deploy(WBGLTest, owneraddr, {from: owneraddr})
    ]);
    let WBGLInstance = (await WBGLTest.deployed());
    WBGLaddr = WBGLInstance.address;

    //mint to test account
    await WBGLInstance.mint("", web3.utils.toBN("8000000000000000000000"));
  }

  if (owneraddr == '') {
    throw("ERROR: owner address");
  }

  if (WBGLaddr == '') {
    throw("ERROR: WBGL address");
  }

  //let comptrollerInstance = (await Unitroller.deployed());
  let comptrollerInstance = (await Comptroller.at((await Unitroller.deployed()).address)); // treat Unitroller as Comptroller
  let RateModelInstance = (await JumpRateModelV2.deployed());

  await Promise.all([
    deployer.deploy(CErc20Delegate, {from: owneraddr})
  ]);
  
  let WBGLDelegateInstance = (await CErc20Delegate.deployed());

  await Promise.all([
    deployer.deploy(CErc20Delegator, 
      WBGLaddr, 
      comptrollerInstance.address,
      RateModelInstance.address,
      web3.utils.toBN("200000000000000000000000000"),
      "Savy WBGL",
      "svWBGL",
      8,
      owneraddr,
      WBGLDelegateInstance.address,
      0,
      {from: owneraddr}),
  ]);

  let CWBGLDelegateInstance = (await CErc20Delegator.deployed());
  await comptrollerInstance._supportMarket(CWBGLDelegateInstance.address);

  // setting collateral factor requires underlying price != 0
  const GatedPriceOracle = artifacts.require('GatedPriceOracle');
  let oracleInstance = (await GatedPriceOracle.deployed());
  await oracleInstance.setDirectPrice(WBGLaddr, web3.utils.toBN("64500000000000000")) // 0.0645 USD (Pancakeswap price during deploy)

  await comptrollerInstance._setCollateralFactor(CWBGLDelegateInstance.address, web3.utils.toBN("800000000000000000"));

  console.log(`WBGL deployed address: ${WBGLaddr}`);
  console.log(`svWBGL deployed address: ${WBGLDelegateInstance.address}`);
};
