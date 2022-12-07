import logging
import time
from decimal import Decimal

from django.core.management import BaseCommand
from django.db import transaction
from django.db.models import F
from web3.exceptions import TransactionNotFound

from app.models import internal_options as io, Artwork, ArtworkEvent, SaleListing, GenerationProcess
# from vancat import const
from vancat.crypto import ethereum, MARKETPLACE_ADDRESS


class Command(BaseCommand):
    def handle(self, *args, **options):
        io.nft_last_block = ethereum.web3.eth.blockNumber

        while True:
            try:
                with transaction.atomic():
                    nft_contract = ethereum.get_nft_contract()
                    marketplace_contract = ethereum.get_marketplace_contract()

                    to_block = ethereum.web3.eth.blockNumber - 1
                    if not io.nft_last_block:
                        io.nft_last_block = to_block

                    if io.nft_last_block < to_block:
                        logging.warning('Last remembered block: {}, current last: {}'.format(io.nft_last_block, to_block))
                        if to_block - io.nft_last_block > 500:
                            to_block = io.nft_last_block + 500
                        from_block = io.nft_last_block + 1
                        logging.warning('  Checking blocks {} ~ {}'.format(from_block, to_block))

                        minted = set()

                        # mint
                        evts = nft_contract.events.Mint().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            uuid = evt.args.uuid.hex()[:32]
                            Artwork.objects.filter(uuid=uuid).update(token_id=evt.args.tokenId)
                            logging.warning('    Minted token #{} ({})'.format(evt.args.tokenId, uuid))
                            minted.add(evt.args.tokenId)

                        # transfer
                        evts = nft_contract.events.Transfer().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            if evt.args.to == MARKETPLACE_ADDRESS:
                                continue
                            Artwork.objects.filter(token_id=evt.args.tokenId).update(owner=evt.args.to)
                            logging.warning('    Transfer token #{} to {}'.format(evt.args.tokenId, evt.args.to))
                            if MARKETPLACE_ADDRESS not in (evt.args.to, evt.args['from']):
                                ArtworkEvent.objects.create(token_id=evt.args.tokenId,
                                                            event='mint' if evt.args.tokenId in minted else 'transfer',
                                                            from_address=evt.args['from'],
                                                            to_address=evt.args['to'])

                        # list
                        evts = marketplace_contract.events.Listed().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            listing_id = evt.args.listingId
                            token_id, price, seller, buyer, closed = evt.args.listing
                            try:
                                artwork = Artwork.objects.get(token_id=token_id)
                            except Artwork.DoesNotExist:
                                continue
                            price = Decimal(price) / 10 ** 18
                            SaleListing.objects.create(listing_id=listing_id,
                                                       artwork=artwork,
                                                       price=price,
                                                       seller=seller)
                            ArtworkEvent.objects.create(token_id=token_id,
                                                        event='list',
                                                        from_address=seller,
                                                        data={'price': str(price)})
                            logging.warning('    List token #{} for {:.6f}'.format(token_id, price))

                        # cancel list
                        evts = marketplace_contract.events.Cancelled().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            listing_id = evt.args.listingId
                            token_id, price, seller, buyer, closed = evt.args.listing
                            listing = SaleListing.objects.get(listing_id=listing_id)
                            listing.closed = True
                            listing.save()
                            ArtworkEvent.objects.create(token_id=token_id,
                                                        event='cancel',
                                                        from_address=seller)
                            logging.warning('    List cancelled #{}'.format(token_id))

                        # trade
                        evts = marketplace_contract.events.Bought().getLogs(fromBlock=from_block, toBlock=to_block)
                        for evt in evts:
                            listing_id = evt.args.listingId
                            token_id, price, seller, buyer, closed = evt.args.listing
                            price = Decimal(price) / 10 ** 18
                            listing = SaleListing.objects.get(listing_id=listing_id)
                            listing.buyer = buyer
                            listing.closed = True
                            listing.save()
                            ArtworkEvent.objects.create(token_id=token_id,
                                                        event='buy',
                                                        from_address=buyer,
                                                        data={'price': str(price)})
                            logging.warning('    Token #{} bought by {}'.format(token_id, buyer))

                        for gen in GenerationProcess.objects.filter(ejaculation_confirmed__isnull=True):
                            try:
                                txr = ethereum.web3.eth.getTransactionReceipt(gen.ejaculation_tx)
                                tx = ethereum.web3.eth.getTransaction(gen.ejaculation_tx)
                                if txr.status and tx.input == '0x251f30aa':
                                    gen.ejaculation_confirmed = True
                                else:
                                    gen.ejaculation_confirmed = False
                                gen.save()
                            except TransactionNotFound:
                                pass

                        for gen in GenerationProcess.objects.filter(ovulation_confirmed__isnull=True):
                            try:
                                txr = ethereum.web3.eth.getTransactionReceipt(gen.ovulation_tx)
                                tx = ethereum.web3.eth.getTransaction(gen.ovulation_tx)
                                if txr.status and tx.input == '0xb9a98073':
                                    gen.ovulation_confirmed = True
                                else:
                                    gen.ejaculation_confirmed = False
                                gen.save()
                            except TransactionNotFound:
                                pass

                        io.nft_last_block = to_block

                        if ethereum.web3.eth.blockNumber != to_block:
                            continue
            except KeyboardInterrupt:
                logging.warning('Stopping...')
                return
            except ValueError as e:
                logging.exception(str(e.args))
            except Exception as e:
                logging.exception(e)
                time.sleep(5)

            time.sleep(.3)
