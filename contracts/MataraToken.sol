// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MataraToken is ERC20 {
    address payable public owner;
    constructor(uint256 initialSupply) ERC20("MataraToken", "MTR"){
        owner = msg.sender;
        _mint(owner, initialSupply);
    }

}