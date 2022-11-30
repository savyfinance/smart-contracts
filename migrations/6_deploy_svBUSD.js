const CErc20Delegate = artifacts.require('CErc20Delegate');
const CErc20Delegator = artifacts.require('CErc20Delegator');
const BUSDTest = artifacts.require('BUSDTest');
const JumpRateModelV2 = artifacts.require('JumpRateModelV2');
const Unitroller = artifacts.require('Unitroller');
const Comptroller = artifacts.require('Comptroller');

module.exports = async function (deployer, network, accounts) {
  let owneraddr = "";
  let BUSDaddr = "";

  if (network == "live" || network == "live-fork") {
    throw("not supported");
  } else if (network == "bsc" || network == "bsc-fork") {
    owneraddr = "";
    BUSDaddr = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  } else if (network == "bsctest" || network == "bsctest-fork") {
    owneraddr = "";
    await Promise.all([
      deployer.deploy(BUSDTest, owneraddr, {from: owneraddr})
    ]);
    let BUSDInstance = (await BUSDTest.deployed());
    BUSDaddr = BUSDInstance.address;
  } else {
    owneraddr = accounts[0];
    await Promise.all([
      deployer.deploy(BUSDTest, owneraddr, {from: owneraddr})
    ]);
    let BUSDInstance = (await BUSDTest.deployed());
    BUSDaddr = BUSDInstance.address;

    //mint to test account
    await BUSDInstance.mint("0x1d883459BBC71042a9072f106427c4993De44794", web3.utils.toBN("500000000000000000000"));
  }

  if (owneraddr == '') {
    throw("ERROR: owner address");
  }

  if (BUSDaddr == '') {
    throw("ERROR: BUSD address");
  }

  //let comptrollerInstance = (await Unitroller.deployed());
  let comptrollerInstance = (await Comptroller.at((await Unitroller.deployed()).address)); // treat Unitroller as Comptroller
  let RateModelInstance = (await JumpRateModelV2.deployed());

  await Promise.all([
    deployer.deploy(CErc20Delegate, {from: owneraddr})
  ]);
  
  let BUSDDelegateInstance = (await CErc20Delegate.deployed());

  await Promise.all([
    deployer.deploy(CErc20Delegator, 
      BUSDaddr, 
      comptrollerInstance.address,
      RateModelInstance.address,
      web3.utils.toBN("200000000000000000000000000"),
      "Savy BUSD",
      "svBUSD",
      8,
      owneraddr,
      BUSDDelegateInstance.address,
      0,
      {from: owneraddr}),
  ]);

  let CBUSDDelegateInstance = (await CErc20Delegator.deployed());
  await comptrollerInstance._supportMarket(CBUSDDelegateInstance.address);

  // setting collateral factor requires underlying price != 0
  const GatedPriceOracle = artifacts.require('GatedPriceOracle');
  let oracleInstance = (await GatedPriceOracle.deployed());
  await oracleInstance.setDirectPrice(BUSDaddr, web3.utils.toBN("1000000000000000000")) // 1.01 USD

  await comptrollerInstance._setCollateralFactor(CBUSDDelegateInstance.address, web3.utils.toBN("800000000000000000"));

  console.log(`BUSD deployed address: ${BUSDaddr}`);
  console.log(`svBUSD deployed address: ${CBUSDDelegateInstance.address}`);
};
