import os
from hashlib import sha1
from io import BytesIO

import graphene
import jwt
import magic
from PIL import Image
from django.conf import settings
from django.core.files.base import ContentFile
from eth_account.messages import encode_defunct
from graphene_file_upload.scalars import Upload
from graphql import GraphQLError
from web3 import Web3
from constance import config

from app.models import Profile, Artwork, GenerationProcess
from app.schema.types import ProfileInputType, ProfileType, ArtworkInputType, GeneratedArtworkInputType
from vancat.crypto import ethereum, NFT_ADDRESS
from vancat.decorators import login_required
from vancat.utils import validate_nonce


class SignInMutation(graphene.Mutation):
    class Arguments:
        nonce = graphene.String(required=True)
        signature = graphene.String(required=True)

    token = graphene.String()

    @classmethod
    def mutate(cls, root, info, nonce, signature):
        validate_nonce(nonce)
        address = ethereum.recover_message('SignIn:{}'.format(nonce), signature)
        token = jwt.encode({'address': address}, settings.SECRET_KEY, algorithm="HS256").decode()
        Profile.objects.get_or_create(address=ethereum.web3.toChecksumAddress(address))
        return SignInMutation(token=token)


class UpdateProfileMutation(graphene.Mutation):
    class Arguments:
        input = ProfileInputType(required=True)
        avatar = Upload()
        remove_avatar = graphene.Boolean()
        nonce = graphene.String(required=True)
        signature = graphene.String(required=True)

    profile = graphene.Field(ProfileType)

    @classmethod
    def mutate(cls, root, info, input: ProfileInputType, avatar, remove_avatar, nonce, signature):
        validate_nonce(nonce)
        address = ethereum.recover_message('UpdateProfile:{}'.format(nonce), signature)
        profile, _ = Profile.objects.get_or_create(address=address)
        if Profile.objects.filter(username__iexact=input.username).exclude(pk=profile.pk).exists():
            raise GraphQLError('Username is already in use')
        print(address, input.__dict__)
        profile.username = input.username
        profile.bio = input.bio
        profile.facebook = input.facebook
        profile.telegram = input.telegram
        profile.instagram = input.instagram
        profile.twitter = input.twitter
        if remove_avatar:
            profile.avatar = None
        elif avatar:
            profile.avatar = avatar
        profile.save()
        return cls(profile=profile)


class CreateStandardNFTMutation(graphene.Mutation):
    class Arguments:
        input = ArtworkInputType(required=True)
        minter = graphene.String()

    args = graphene.JSONString()

    @classmethod
    def mutate(cls, root, info, input: ArtworkInputType, minter):
        if input.artwork.size > (20 * 10**20):
            raise GraphQLError('File size exceeds 20 MB')

        mime_type = magic.from_buffer(input.artwork.read(1024), mime=True)
        input.artwork.seek(0)
        print(mime_type)
        if not (mime_type in ['image/jpeg', 'image/png'] or
                mime_type == 'video/mp4' or
                mime_type == 'image/gif'):
            raise GraphQLError('Invalid file was uploaded')

        token = Artwork(title=input.title, category=input.category, description=input.description, artwork=input.artwork,
                        exclusive_info=input.exclusive_info, royalties=input.royalties, minter=minter)
        token.save()
        metadata_uri = str(token.uuid)
        print([minter, metadata_uri, token.royalties, NFT_ADDRESS])
        h = Web3.soliditySha3(['address', 'string', 'uint256', 'address'], [minter, metadata_uri, token.royalties, NFT_ADDRESS])
        msg = encode_defunct(h)
        signed = Web3().eth.account.sign_message(msg, config.MINTER_PK)
        return cls(args=[metadata_uri, '0x' + token.uuid.hex, str(token.royalties), signed.signature.hex()])


class GenerationEjaculationMutation(graphene.Mutation):
    class Arguments:
        txid = graphene.String()

    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, txid):
        if GenerationProcess.objects.filter(owner=info.context.profile, artwork__isnull=True).exists():
            raise GraphQLError('Ejaculation is already performed')

        gen = GenerationProcess.objects.create(owner=info.context.profile, ejaculation_tx=txid)
        return cls(ok=True)


class GenerationOvulationMutation(graphene.Mutation):
    class Arguments:
        txid = graphene.String()

    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, txid):
        if not GenerationProcess.objects.filter(owner=info.context.profile, ejaculation_tx__isnull=False, artwork__isnull=True).exists():
            raise GraphQLError('Ejaculation is not performed yet')

        gen = GenerationProcess.objects.get(owner=info.context.profile, ejaculation_tx__isnull=False, artwork__isnull=True)
        gen.ovulation_tx = txid
        gen.save()
        return cls(ok=True)


class GenerationDNAMutation(graphene.Mutation):
    class Arguments:
        pass

    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info):
        if not GenerationProcess.objects.filter(owner=info.context.profile, ovulation_tx__isnull=False, artwork__isnull=True).exists():
            raise GraphQLError('Ovulation is not performed yet')

        gen = GenerationProcess.objects.get(owner=info.context.profile, ejaculation_tx__isnull=False, artwork__isnull=True)
        if not gen.ejaculation_confirmed or not gen.ovulation_confirmed:
            raise GraphQLError('Ejaculation or ovulation are not confirmed yet')

        gen.dna = sha1((gen.ejaculation_tx + gen.ovulation_tx).encode()).digest()

        im = Image.new('RGBA', (1080, 1080), (255, 255, 255))
        for i in range(1, 7):
            ll = [p for p in os.listdir(settings.BASE_DIR / f'generation_images/layer-{i}') if p.endswith('.png')]
            oim = Image.open(settings.BASE_DIR / f'generation_images/layer-{i}/{ll[gen.dna[i - 1] % len(ll)]}')
            im.paste(oim, (0, 0), oim)
        output = BytesIO()
        im.save(output, 'PNG')
        gen.image.save('artwork.png', ContentFile(output.getvalue()))

        gen.save()
        return cls(ok=True)


class CreateGeneratedNFTMutation(graphene.Mutation):
    class Arguments:
        input = GeneratedArtworkInputType(required=True)
        minter = graphene.String()

    args = graphene.JSONString()

    @classmethod
    def mutate(cls, root, info, input: GeneratedArtworkInputType, minter):
        if not GenerationProcess.objects.filter(owner=info.context.profile, dna__isnull=False, artwork__isnull=True).exists():
            raise GraphQLError('DNA is not generated yet')

        gen = GenerationProcess.objects.get(owner=info.context.profile, dna__isnull=False, artwork__isnull=True)

        token = Artwork(title=input.title, category=input.category, description=input.description, artwork=gen.image,
                        exclusive_info=input.exclusive_info, royalties=input.royalties, minter=minter)
        token.save()
        gen.artwork = token
        gen.save()
        metadata_uri = str(token.uuid)
        h = Web3.soliditySha3(['address', 'string', 'uint256', 'address'], [minter, metadata_uri, token.royalties, NFT_ADDRESS])
        msg = encode_defunct(h)
        signed = Web3().eth.account.sign_message(msg, config.MINTER_PK)
        return cls(args=[metadata_uri, '0x' + token.uuid.hex, str(token.royalties), signed.signature.hex()])


class Mutation(graphene.ObjectType):
    sign_in = SignInMutation.Field()
    update_profile = UpdateProfileMutation.Field()
    create_standard_nft = CreateStandardNFTMutation.Field()

    gen_ejaculation = GenerationEjaculationMutation.Field()
    gen_ovulation = GenerationOvulationMutation.Field()
    gen_dna = GenerationDNAMutation.Field()
    create_generated_nft = CreateGeneratedNFTMutation.Field()
