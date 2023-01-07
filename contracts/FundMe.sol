// Get funds from users and withdraw fund for owner
// Set minimum funding value in USD

//Chain link are only watching on Goerli testnet and real networks, there's no chainlink in JS EVM

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "./PriceConverterLib.sol";

error NotOwner(); //More gas efficient way to throw errors

//@smartcontractkit is npm package for chainlink

contract FundMe {
    //constant is more cost efficience
    address public immutable owner; //immutable can only be updated once in the constructor, works the same as constant outside of constructor

    constructor() {
        owner = msg.sender;
    }

    using PriceConverterLib for uint256;
    // libraries are similar to contracts except for holding funds or state variables
    uint256 public constant minUSD = 0 * 1e18; //18 decimals

    address[] public funders;
    mapping(address => uint256) public addressToAmount;

    function fund() public payable {
        //Tx fields: Nonce ; Gas price ; Gas limit ; To ; Value ; Data ; signature's v r s
        //public allows anyone to call the functiona and payable makes the contract be able to hold funds
        //Contract funds are seperated from wallets
        msg.value;
        require(msg.value.getConversionPrice() > minUSD, "Didnt send enough");
        //msg.value is taken as the first variable for any of the functions in PriceConverterLib
        //If there's a 2nd or 3rd parameter, pass them accordingly into the function call
        //eg: msg.value.getConversionPrice(param2,param3);
        //1e18 is 1*10^18, the base unit is wei
        funders.push(msg.sender);
        //msg.sender is the address of the function caller
        addressToAmount[msg.sender] = msg.value;
    }

    function withdraw() public onlyOnwer {
        // require(owner == msg.sender,"Not the owner");
        // for loop
        for (uint256 i = 0; i < funders.length; i = i + 1) {
            address funder = funders[i];
            addressToAmount[funder] = 0;
        }
        // reseting array
        funders = new address[](0);
        // allocate new array with 0 items
        payable(msg.sender).transfer(address(this).balance);
        //payable(msg.sender) typecasts address into payable address ( the only way to deal with money in smart contract)
        // transfer/send caps at 2k3 gas, transfer throws error, send returns false if gas used exceed cap
        // bool sendSuccess = payable(msg.sender).transfer(address(this).balance);
        // require(sendSuccess,"Send failed");
        (bool callSuccess, bytes memory data) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        // since byte is an array, it needs to be in memory type
        require(callSuccess, "Call failed");
        //msg.sender is contract creator calling the function
    }

    //Modifer is a keyword that cna be added to function to modify it
    modifier onlyOnwer() {
        // require (msg.sender==owner,"Not the original owner");
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _; //Do the rest of the code, if its the end of the modifier, do the code before modifier
    }

    //receive/fallback executed when a function that doesnt exist is called
    //receive is triggered anytime a contract is called
    //if a function is specified, this is when fallback comes in
    //receive() external payable{//code}
    //if receive doesnt exist, it reverts back to fallback
    //fallback() external payable{//code}
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
