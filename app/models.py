from uuid import uuid4

from django.db import models
from django_extensions.db.fields import RandomCharField
from sorl.thumbnail import ImageField

from app.options import InternalOptions

internal_options = InternalOptions()


class ArtworkCategory(models.TextChoices):
    GAMES = 'games'
    ART = 'art'
    PHOTO = 'photo'
    MUSIC = 'music'


class Profile(models.Model):
    address = models.CharField(max_length=64, db_index=True)
    username = RandomCharField(length=32, editable=True, unique=True)
    bio = models.TextField(default='')
    avatar = ImageField(upload_to='avatars', null=True, blank=True)
    instagram = models.CharField(max_length=64, default='')
    twitter = models.CharField(max_length=64, default='')
    facebook = models.CharField(max_length=64, default='')
    telegram = models.CharField(max_length=64, default='')


class Artwork(models.Model):
    uuid = models.UUIDField(default=uuid4)
    title = models.CharField(max_length=64)
    category = models.CharField(max_length=8, choices=ArtworkCategory.choices)
    description = models.TextField()
    artwork = models.FileField()
    exclusive_info = models.TextField()
    royalties = models.PositiveSmallIntegerField()
    minter = models.CharField(max_length=64, db_index=True)
    owner = models.CharField(null=True, blank=True, max_length=64, db_index=True)
    token_id = models.PositiveBigIntegerField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ArtworkEvent(models.Model):
    token_id = models.PositiveBigIntegerField(null=True, db_index=True)
    datetime = models.DateTimeField(auto_now_add=True)
    from_address = models.CharField(max_length=64)
    to_address = models.CharField(max_length=64, null=True, blank=True)
    event = models.CharField(max_length=64, db_index=True)
    data = models.JSONField(null=True, blank=True)


class SaleListing(models.Model):
    listing_id = models.PositiveBigIntegerField(db_index=True)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='listings')
    price = models.DecimalField(max_digits=64, decimal_places=18)
    seller = models.CharField(max_length=64, null=True, blank=True)
    buyer = models.CharField(max_length=64, null=True, blank=True)
    closed = models.BooleanField(default=False)


class GenerationProcess(models.Model):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='gen_processes')
    ejaculation_tx = models.CharField(max_length=128, db_index=True)
    ejaculation_confirmed = models.BooleanField(null=True)
    ovulation_tx = models.CharField(max_length=128, db_index=True)
    ovulation_confirmed = models.BooleanField(null=True)
    dna = models.BinaryField(max_length=20, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='gen_processes', null=True, blank=True)
