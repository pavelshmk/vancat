from time import sleep
from datetime import datetime, timedelta

import requests
from django.core.management import BaseCommand

from app.models import internal_options as io


class Command(BaseCommand):
    def handle(self, *args, **options):
        while True:
            if not io.tokenomics_last_update or datetime.now() - io.tokenomics_last_update >= timedelta(1):
                last_burnt = io.tokenomics_burnt
                r = requests.get('https://api.bscscan.com/api', params={
                    'module': 'account',
                    'action': 'tokenbalance',
                    'contractaddress': '0x8597ba143ac509189e89aab3ba28d661a5dd9830',
                    'address': '0x000000000000000000000000000000000000dead',
                    'tag': 'latest',
                    'apikey': '4P3EJYYTE6HCFTTH4H23TZGBQK53D3WX49',
                }).json()
                io.tokenomics_burnt = int(r['result'])
                io.tokenomics_burnt_delta = io.tokenomics_burnt - last_burnt
                io.tokenomics_last_update = datetime.now()
                print('updated')

            sleep(60)
