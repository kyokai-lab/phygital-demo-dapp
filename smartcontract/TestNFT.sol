// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


contract ProductItem is ERC721, Ownable, AccessControl, ERC721Enumerable {    
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    string private baseURL;


    constructor(string memory _name, string memory _symbol, string memory _contractURI) ERC721(_name, _symbol) {
        baseURL = _contractURI;
    }


    function safeMint(address to) public onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
       
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
       
        _safeMint(to, tokenId);
        return tokenId;
    }


    function _baseURI() internal view override returns (string memory) {
        return baseURL;
    }


    function setBaseURI(string memory _uri) external onlyOwner {
        baseURL = _uri;
    }


    function tokenURI(uint256 tokenId) public view override returns (string memory)
    {
       
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
 
        return string(abi.encodePacked(_baseURI(), tokenId.toString()));
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
