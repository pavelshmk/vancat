from django.core.cache import cache
from graphql import GraphQLError


def validate_nonce(nonce):
    cache_key = 'nonce:{}'.format(nonce)
    if cache.get(cache_key) is None:
        raise GraphQLError('Invalid nonce')
    cache.delete(cache_key)
