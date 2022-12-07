import json

from django.conf import settings
from eth_account.messages import encode_defunct
from eth_account.signers.local import LocalAccount
from web3 import Web3, HTTPProvider
from web3.middleware import geth_poa_middleware


with open(settings.BASE_DIR / 'frontend' / 'src' / 'contracts' / 'addresses.json') as f:
    ADDRESSES = json.load(f)

with open(settings.BASE_DIR / 'frontend' / 'src' / 'contracts' / 'nft.abi.json') as f:
    NFT_ABI = json.load(f)

with open(settings.BASE_DIR / 'frontend' / 'src' / 'contracts' / 'marketplace.abi.json') as f:
    MARKETPLACE_ABI = json.load(f)


NFT_ADDRESS = ADDRESSES['nft']
MARKETPLACE_ADDRESS = ADDRESSES['marketplace']


class Ethereum:
    @property
    def web3(self):
        w3 = Web3(HTTPProvider('https://data-seed-prebsc-2-s2.binance.org:8545/'))
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        return w3

    def create_address(self):
        return self.web3.geth.personal.new_account('')

    def create_pk(self):
        acc = self.web3.eth.account.create()  # type: LocalAccount
        return acc.key

    def validate_address(self, address):
        return self.web3.isAddress(address)

    def normalize_address(self, address):
        return self.web3.toChecksumAddress(address)

    def recover_message(self, message: str, signature: str):
        h = encode_defunct(text=message)
        return self.web3.eth.account.recover_message(h, signature=signature)

    def get_marketplace_contract(self):
        return self.web3.eth.contract(address=ADDRESSES['marketplace'], abi=MARKETPLACE_ABI)

    def get_nft_contract(self):
        return self.web3.eth.contract(address=ADDRESSES['nft'], abi=NFT_ABI)


ethereum = Ethereum()
