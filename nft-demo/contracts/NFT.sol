// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NFT is ERC721, AccessControl, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private currentTokenId;

    /// @dev Base token URI used as a prefix by tokenURI().
    string public baseTokenURI;

    constructor() ERC721("DappDemo", "DappNFT") {
        baseTokenURI = "";
    }

    function mintTo(address recipient) public returns (uint256) {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(recipient, newItemId);
        return newItemId;
    }

    /// @dev Returns an URI for a given token ID
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    /// @dev Sets the base token URI prefix.
    function setBaseTokenURI(string memory _baseTokenURI) public {
        baseTokenURI = _baseTokenURI;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl, ERC721, ERC721Enumerable) returns (bool) {
        return ERC721.supportsInterface(interfaceId);
    }

    // Override the conflicting _beforeTokenTransfer function
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        // Call the _beforeTokenTransfer functions from the base contracts
        ERC721._beforeTokenTransfer(from, to, tokenId, batchSize);
        ERC721Enumerable._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}