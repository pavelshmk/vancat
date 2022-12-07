// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.5;

import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC20/IERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC20/ERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/access/Ownable.sol";

contract GenerateSpermToken is ERC20, Ownable {
    constructor() ERC20("GenerateSpermToken", "GST") {}

    function mint(address to, uint256 value) public {
        _mint(to, value);
    }

    function burn(uint256 value) public {
        _burn(_msgSender(), value);
    }

    function ejaculation() public {
        _burn(msg.sender, 100);
    }
}

contract GenerateEggToken is ERC20, Ownable {
    constructor() ERC20("GenerateEggToken", "GET") {}

    function mint(address to, uint256 value) public {
        _mint(to, value);
    }

    function burn(uint256 value) public {
        _burn(_msgSender(), value);
    }

    function ovulation() public {
        _burn(msg.sender, 100);
    }
}
