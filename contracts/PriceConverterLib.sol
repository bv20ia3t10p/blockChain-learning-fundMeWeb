//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverterLib {
    function getPrice() internal view returns (uint256) {
        // To interact with contracts outside of project, ABI is needed
        // Address 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e (Goerli testnet on Chainlink's pricefeed for ETH/USD)
        // ABI contains information of functions that are callable and their names, parameters
        // An interface is sort of a prototype for functions in a contract,
        // functions in interface can be declared outside ( in another contract ) => Transparency
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        // (uint80 roundId, int price,uint startedAt, uint timeStamp,uint80 answeredInRound) = priceFeed.latestRoundData();
        (, int price, , , ) = priceFeed.latestRoundData();
        // Can call function decimals() in Aggerator v3 to know how many decimals price takes up.
        return uint256(price * 1e10); //Converting wei to eth
    }

    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        return priceFeed.version();
    }

    function getConversionPrice(uint256 eth) internal view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmount = (ethPrice * eth) / 1e18; //multiple before divide
        return ethAmount;
    }
}
