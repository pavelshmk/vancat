import graphene
from django.core.cache import cache
from django.db.models import Q
from django.utils.crypto import get_random_string
from graphql import GraphQLError
from app.models import internal_options as io

from app.models import Profile, Artwork, GenerationProcess
from app.schema.types import ProfileType, ArtistsResponseType, GalleryResponseType, ArtworkCategoryEnum, ArtworkType, \
    GenerationProcessType, TokenomicsInfoType
from vancat.decorators import login_required


class Query(graphene.ObjectType):
    profile = graphene.Field(ProfileType, search=graphene.String(required=True))
    artists = graphene.Field(ArtistsResponseType, page=graphene.Int(), q=graphene.String())
    nonce = graphene.String(required=True)
    gallery = graphene.Field(GalleryResponseType, page=graphene.Int(), q=graphene.String(), category=ArtworkCategoryEnum())
    artwork = graphene.Field(ArtworkType, uuid=graphene.String())
    generation_process = graphene.Field(GenerationProcessType)
    tokenomics_info = graphene.Field(TokenomicsInfoType)

    @classmethod
    def resolve_profile(cls, root, info, search):
        try:
            if search.startswith('@'):
                return Profile.objects.filter(username__iexact=search[1:]).first()
            elif search.startswith('0x'):
                return Profile.objects.get(address__iexact=search)
            else:
                raise GraphQLError('Invalid creator query')
        except Profile.DoesNotExist:
            raise GraphQLError('Creator not found')

    @classmethod
    def resolve_nonce(cls, root, info):
        nonce = get_random_string(length=10)
        cache.set('nonce:{}'.format(nonce), 1)
        return nonce

    @classmethod
    def resolve_artists(cls, root, info, page=0, q=''):
        qs = Profile.objects.all()
        if q:
            qs = qs.filter(username__icontains=q)
        return {
            'total_items': qs.count(),
            'items': qs[page*12:(page+1)*12],
        }

    @classmethod
    def resolve_gallery(cls, root, info, page=0, q='', category=None):
        qs = Artwork.objects.filter(token_id__isnull=False)
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))
        if category:
            qs = qs.filter(category=category)
        return {
            'total_items': qs.count(),
            'items': qs[page*12:(page+1)*12],
        }

    @classmethod
    def resolve_artwork(cls, root, info, uuid):
        try:
            return Artwork.objects.get(uuid=uuid)
        except Artwork.DoesNotExist:
            raise GraphQLError('Artwork does not exist')

    @classmethod
    @login_required
    def resolve_generation_process(cls, root, info):
        return GenerationProcess.objects.filter(owner=info.context.profile, artwork__isnull=True).first()

    @classmethod
    def resolve_tokenomics_info(cls, root, info):
        return {
            'burnt': io.tokenomics_burnt,
            'burnt_delta': io.tokenomics_burnt_delta,
        }
