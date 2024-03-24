// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract MataraToken is ERC20Capped {
    address payable public owner;
    constructor(uint256 cap) ERC20("MataraToken", "MTR") ERC20Capped(cap * (10 ** decimals())){
        owner = msg.sender;
        _mint(owner, 70000000 * (10 ** decimals()));
    }

}