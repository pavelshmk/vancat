// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.5;

import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC20/IERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC20/ERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/access/Ownable.sol";

contract PaymentToken is ERC20, Ownable {
    constructor() ERC20("Payment Token", "PT") {}

    function mint(address to, uint256 value) public {
        _mint(to, value);
    }

    function burn(uint256 value) public {
        _burn(_msgSender(), value);
    }
}
