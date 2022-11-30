pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WBGLTest is ERC20("WBGLTest", "TWBGL") {

    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }

    function mint(address _receiver, uint256 _amount) public {
        require(msg.sender == owner, "owner only");
        _mint(_receiver, _amount);
    }
}
