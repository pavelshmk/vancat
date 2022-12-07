import json

from brownie import NFT, PaymentToken, Marketplace, GenerateSpermToken, GenerateEggToken


def main():
    with open('../frontend/src/contracts/nft.abi.json', 'w') as f:
        json.dump(NFT[-1].abi, f)

    with open('../frontend/src/contracts/paymentToken.abi.json', 'w') as f:
        json.dump(PaymentToken[-1].abi, f)

    with open('../frontend/src/contracts/marketplace.abi.json', 'w') as f:
        json.dump(Marketplace[-1].abi, f)

    with open('../frontend/src/contracts/sperm.abi.json', 'w') as f:
        json.dump(GenerateSpermToken[-1].abi, f)

    with open('../frontend/src/contracts/egg.abi.json', 'w') as f:
        json.dump(GenerateEggToken[-1].abi, f)
