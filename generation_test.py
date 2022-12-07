import os
from pathlib import Path
from random import randint

from PIL import Image, ImageDraw


def generate_artwork(dna: bytes):
    im = Image.new('RGBA', (1080, 1080), (255, 255, 255))
    for i in range(1, 7):
        ll = [p for p in os.listdir(f'generation_images/layer-{i}') if p.endswith('.png')]
        oim = Image.open(f'generation_images/layer-{i}/{ll[dna[i-1] % len(ll)]}')
        im.paste(oim, (0, 0), oim)
    im.show()


generate_artwork(os.urandom(10))
