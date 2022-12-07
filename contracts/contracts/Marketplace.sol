pragma solidity 0.8.5;

import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/utils/Counters.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC20/IERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC20/utils/SafeERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC721/IERC721.sol";
import "OpenZeppelin/openzeppelin-contracts@4.3.2/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./NFT.sol";

contract Marketplace is ERC721Holder {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    struct Listing {
        uint256 tokenId;
        uint256 price;
        address seller;
        address buyer;
        bool closed;
    }

    mapping (uint256 => Listing) internal _listings;
    Counters.Counter internal _listingIds;
    IERC20 internal _paymentToken;
    NFT internal _nft;

    event Listed(uint256 listingId, Listing listing);
    event Cancelled(uint256 listingId, Listing listing);
    event Bought(uint256 listingId, Listing listing);

    constructor(IERC20 paymentToken, NFT nft) {
        _paymentToken = paymentToken;
        _nft = nft;
    }

    function list(uint256 tokenId, uint256 price) external {
        _nft.safeTransferFrom(msg.sender, address(this), tokenId);

        _listingIds.increment();
        uint256 listingId = _listingIds.current();
        _listings[listingId].tokenId = tokenId;
        _listings[listingId].price = price;
        _listings[listingId].seller = msg.sender;

        emit Listed(listingId, _listings[listingId]);
    }

    function cancel(uint256 listingId) external {
        require(_listings[listingId].seller == msg.sender, "you do not own this listing");
        require(!_listings[listingId].closed, "the listing is already closed");

        _listings[listingId].closed = true;
        _nft.safeTransferFrom(address(this), msg.sender, _listings[listingId].tokenId);

        emit Cancelled(listingId, _listings[listingId]);
    }

    function buy(uint256 listingId) external {
        Listing storage listing = _listings[listingId];
        require(!listing.closed, "the listing is already closed");

        uint256 royalties = 0;
        address minter = _nft.minters(listing.tokenId);
        if (listing.seller != minter) {
            royalties = listing.price * _nft.tokenRoyalties(listing.tokenId) / 100;
            _paymentToken.safeTransferFrom(msg.sender, minter, royalties);
        }
        _paymentToken.safeTransferFrom(msg.sender, listing.seller, listing.price - royalties);
        _nft.safeTransferFrom(address(this), msg.sender, listing.tokenId);
        listing.buyer = msg.sender;
        listing.closed = true;

        emit Bought(listingId, listing);
    }
}
