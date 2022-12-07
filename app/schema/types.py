import graphene
from graphene_django import DjangoObjectType, DjangoListField
from graphene_file_upload.scalars import Upload
from sorl.thumbnail import get_thumbnail

from app.models import Profile, ArtworkCategory, Artwork, ArtworkEvent, SaleListing, GenerationProcess


def paginated_type(name, cls):
    _ = type(name, (graphene.ObjectType,), {
        'total_items': graphene.Int(),
        'items': DjangoListField(cls),
    })
    return _


class UrlField(graphene.ObjectType):
    url = graphene.String()


class ArtworkEventType(DjangoObjectType):
    from_address_data = graphene.Field('app.schema.types.ProfileType')
    to_address_data = graphene.Field('app.schema.types.ProfileType')

    @staticmethod
    def resolve_from_address_data(event, info):
        try:
            return Profile.objects.get(address__iexact=event.from_address)
        except Profile.DoesNotExist:
            return None

    @staticmethod
    def resolve_to_address_data(event, info):
        try:
            return Profile.objects.get(address__iexact=event.to_address)
        except Profile.DoesNotExist:
            return None

    class Meta:
        model = ArtworkEvent
        fields = 'id', 'token_id', 'datetime', 'from_address', 'to_address', 'event', 'data', 'from_address_data', 'to_address_data',


class SaleListingType(DjangoObjectType):
    class Meta:
        model = SaleListing
        fields = 'listing_id', 'price', 'seller', 'buyer', 'closed',


class ArtworkType(DjangoObjectType):
    events = DjangoListField(ArtworkEventType)
    owner_data = graphene.Field('app.schema.types.ProfileType')
    minter_data = graphene.Field('app.schema.types.ProfileType')
    artwork = graphene.Field(UrlField, size=graphene.Int())
    active_listing = graphene.Field(SaleListingType, required=False)

    @staticmethod
    def resolve_events(artwork, info):
        return ArtworkEvent.objects.filter(token_id=artwork.token_id)

    @staticmethod
    def resolve_owner_data(artwork, info):
        try:
            return Profile.objects.get(address__iexact=artwork.owner)
        except Profile.DoesNotExist:
            return None

    @staticmethod
    def resolve_minter_data(artwork, info):
        try:
            return Profile.objects.get(address__iexact=artwork.minter)
        except Profile.DoesNotExist:
            return None

    @staticmethod
    def resolve_artwork(artwork, info, size=None):
        image = artwork.artwork
        if size:
            image = get_thumbnail(image, f'{size}x{size}', crop='center')
        return {
            'url': info.context.build_absolute_uri(image.url)
        }

    @staticmethod
    def resolve_active_listing(artwork, info):
        return artwork.listings.filter(closed=False).first()

    class Meta:
        model = Artwork
        fields = 'id', 'uuid', 'title', 'category', 'description', 'artwork', 'royalties', 'minter', 'owner', \
                 'token_id', 'created_at', 'active_listing',


GalleryResponseType = paginated_type('GalleryResponseType', ArtworkType)


class ProfileType(DjangoObjectType):
    created_artworks = DjangoListField(ArtworkType)
    owned_artworks = DjangoListField(ArtworkType)

    @staticmethod
    def resolve_avatar(profile, info):
        return info.context.build_absolute_uri(get_thumbnail(profile.avatar, '128x128', crop='center').url) if profile.avatar else None

    @staticmethod
    def resolve_created_artworks(profile, info):
        qs = Artwork.objects.filter(minter__iexact=profile.address, token_id__isnull=False)
        return qs

    @staticmethod
    def resolve_owned_artworks(profile, info):
        qs = Artwork.objects.filter(owner__iexact=profile.address, token_id__isnull=False)
        return qs

    class Meta:
        model = Profile
        fields = 'id', 'address', 'username', 'bio', 'instagram', 'twitter', 'facebook', 'telegram', 'avatar', 'created_artworks', 'owned_artworks',


class ProfileInputType(graphene.InputObjectType):
    username = graphene.String(required=True)
    bio = graphene.String()
    instagram = graphene.String()
    twitter = graphene.String()
    facebook = graphene.String()
    telegram = graphene.String()


ArtistsResponseType = paginated_type('ArtistsResponseType', ProfileType)


ArtworkCategoryEnum = graphene.Enum.from_enum(ArtworkCategory)


class ArtworkInputType(graphene.InputObjectType):
    title = graphene.String()
    category = ArtworkCategoryEnum()
    description = graphene.String()
    artwork = Upload()
    exclusive_info = graphene.String()
    royalties = graphene.Int()


class GeneratedArtworkInputType(graphene.InputObjectType):
    title = graphene.String()
    category = ArtworkCategoryEnum()
    description = graphene.String()
    exclusive_info = graphene.String()
    royalties = graphene.Int()


class GenerationProcessType(DjangoObjectType):
    d_n_a = graphene.List(graphene.Int)

    @staticmethod
    def resolve_d_n_a(gp, info):
        if not gp.dna:
            return []
        return [bytes(gp.dna)[i] for i in range(len(gp.dna))]

    @staticmethod
    def resolve_image(gp, info):
        if not gp.image:
            return None
        return info.context.build_absolute_uri(gp.image.url)

    class Meta:
        model = GenerationProcess
        fields = 'id', 'ejaculation_tx', 'ejaculation_confirmed', 'ovulation_tx', 'ovulation_confirmed', 'd_n_a', 'image',


class TokenomicsInfoType(graphene.ObjectType):
    burnt = graphene.Decimal()
    burnt_delta = graphene.Decimal()
