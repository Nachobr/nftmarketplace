// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    // Use the Counters library for the _tokenIds counter
    Counters.Counter private _tokenIds;

    // Create a mapping to store token prices, with token IDs as keys and prices as values
    mapping(uint256 => uint256) public tokenPrices;
    // Define an event for minting tokens, including tokenId, creator, and price
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 price
    );
    // Define an event for purchasing tokens, including tokenId, buyer, seller, and price
    event TokenPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    // Constructor function for the NFTMarketplace contract, calling the ERC721 constructor with the token name and symbol
    constructor() ERC721("NFT Marketplace", "NFTM") {}

    // Function to mint a new NFT with a specified tokenURI and price
    function mintNFT(string memory tokenURI, uint256 price) public {
        // Increment the _tokenIds counter and get the current value
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // Mint the new token with the newItemId and assign it to the message sender (contract owner)
        _mint(msg.sender, newItemId);
        // Set the tokenURI for the newItemId
        _setTokenURI(newItemId, tokenURI);
        // Store the token price in the tokenPrices mapping
        tokenPrices[newItemId] = price;
        // Emit the TokenMinted event with the newItemId, message sender, and price
        emit TokenMinted(newItemId, msg.sender, price);
    }

    // Function for users to buy an NFT with the specified tokenId, payable with Ether
    function buyToken(uint256 tokenId) public payable {
        // Check if the message value (payment) is greater or equal to the token price
        require(msg.value >= tokenPrices[tokenId], "Insufficient payment");
        // Get the current owner of the tokenId
        address tokenOwner = ownerOf(tokenId);
        // Ensure the buyer is not the current owner of the tokenId
        require(tokenOwner != msg.sender, "Cannot buy your own token");
        // Set the payment variable to the message value
        uint256 payment = msg.value;
        // Transfer the payment to the tokenOwner and check for success
        (bool sent, ) = tokenOwner.call{value: payment}("");
        require(sent, "Payment failed");
        // Transfer the token from the tokenOwner to the message sender (buyer)
        _transfer(tokenOwner, msg.sender, tokenId);
        // Set the token price to 0, as it has been purchased
        tokenPrices[tokenId] = 0;
        // Emit the TokenPurchased event with the tokenId, message sender, tokenOwner, and payment
        emit TokenPurchased(tokenId, msg.sender, tokenOwner, payment);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    // Function to get the price of a token with the specified tokenId
    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        return tokenPrices[tokenId];
    }
}
