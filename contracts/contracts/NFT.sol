// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.5;

import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC20/IERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/access/Ownable.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/utils/cryptography/ECDSA.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/utils/Counters.sol";

interface PaymentToken1 is IERC20 {
    function mint(address to, uint256 value) external;
    function burn(uint256 value) external;
}

contract NFT is Ownable, ERC721URIStorage {
    using ECDSA for bytes32;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    string public baseUri;
    uint256 public transactions;
    mapping (address => bool) public autoAllowances;
    mapping (uint256 => address) public minters;
    mapping (uint256 => uint256) public tokenRoyalties;
    uint256 public mintPrice = 5 * 10**18;
    uint256 public mintBurn = 75;  // in percent
    PaymentToken1 paymentToken;
    uint256 public collectedFee;

    event Mint(uint256 indexed tokenId, bytes32 indexed uuid, address indexed minter);
    event AutoAllowanceSet(address indexed to, bool value);
    event MintPriceChanged(uint256 value);
    event MintBurnChanged(uint256 value);
    event FeeWithdraw(address indexed to, uint256 value);

    constructor(string memory baseUri_, PaymentToken1 paymentToken_) ERC721("VANCAT NFT", "VCN") {
        baseUri = baseUri_;
        paymentToken = paymentToken_;
        emit MintPriceChanged(mintPrice);
        emit MintBurnChanged(mintBurn);
    }

    function setAutoAllowance(address to, bool value) public onlyOwner {
        autoAllowances[to] = value;
        emit AutoAllowanceSet(to, value);
    }

    function setMintPrice(uint256 newValue) public onlyOwner {
        mintPrice = newValue;
        emit MintPriceChanged(newValue);
    }

    function setMintBurn(uint256 newValue) public onlyOwner {
        mintBurn = newValue;
        emit MintBurnChanged(newValue);
    }

    function withdrawFee(address to) public onlyOwner {
        require(collectedFee > 0, "Nothing to withdraw");
        paymentToken.transferFrom(address(this), to, collectedFee);
        emit FeeWithdraw(to, collectedFee);
        collectedFee = 0;
    }

    function _baseURI() override internal view returns (string memory) {
        return baseUri;
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return autoAllowances[operator] || super.isApprovedForAll(owner, operator);
    }

    function mint(string calldata metadataUri, bytes32 uuid, uint256 royalties, bytes calldata sig) public {
        uint256 amountToBurn = mintPrice / 100 * mintBurn;
        uint256 fee = mintPrice - amountToBurn;
        paymentToken.transferFrom(_msgSender(), address(this), mintPrice);
        paymentToken.burn(amountToBurn);
        collectedFee += fee;

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        require(keccak256(abi.encodePacked(_msgSender(), metadataUri, royalties, address(this))).toEthSignedMessageHash().recover(sig) == owner(), "invalid signature");
        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, metadataUri);
        minters[tokenId] = _msgSender();
        tokenRoyalties[tokenId] = royalties;
        emit Mint(tokenId, uuid, _msgSender());
    }

    /*function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }*/

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override virtual {
        transactions++;
        return super._beforeTokenTransfer(from, to, tokenId);
    }
}
