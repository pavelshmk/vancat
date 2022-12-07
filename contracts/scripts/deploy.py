import json

from brownie import accounts, Contract, NFT, PaymentToken, Marketplace, GenerateSpermToken, GenerateEggToken


def main():
    try:
        with open('../frontend/src/contracts/addresses.json', 'r') as f:
            addresses = json.load(f)
    except:
        addresses = {}

    deployer = accounts.load('vancat-deployer')
    # pt: Contract = PaymentToken.deploy({'from': deployer})
    # addresses['payment_token'] = pt.address
    # PaymentToken.publish_source(pt)
    # pt.mint(deployer.address, '1000000000000000000000000', {'from': deployer})

    nft: Contract = NFT.deploy('https://marketplace.vancattoken.com/_meta/', addresses['payment_token'], {'from': deployer})
    addresses['nft'] = nft.address
    NFT.publish_source(nft)
    nft.transferOwnership('0x257133D47d4575857Ced703F7ff52A7686770eE1', {'from': deployer})

    marketplace: Contract = Marketplace.deploy(addresses['payment_token'], NFT[-1].address, {'from': deployer})
    addresses['marketplace'] = marketplace.address
    Marketplace.publish_source(marketplace)

    # sperm: Contract = GenerateSpermToken.deploy({'from': deployer})
    # addresses['sperm'] = sperm.address
    # GenerateSpermToken.publish_source(sperm)
    # sperm.mint('0x174d7BbF81820Ec9CCFed8c775AfA816f2cCCBc8', 10000000000000)
    #
    # egg: Contract = GenerateEggToken.deploy({'from': deployer})
    # addresses['egg'] = egg.address
    # GenerateEggToken.publish_source(egg)
    # egg.mint('0x174d7BbF81820Ec9CCFed8c775AfA816f2cCCBc8', 10000000000000)

    with open('../frontend/src/contracts/addresses.json', 'w') as f:
        json.dump(addresses, f)
