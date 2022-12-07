import logging

import jwt
from django.conf import settings
from django.core.handlers.wsgi import WSGIRequest
from graphql import GraphQLError
from graphql_utilities import run_only_once

from app.models import Profile


class AuthMiddleware:
    @run_only_once
    def resolve(self, next_, root, info, *args, **kwargs):
        info.context.profile = None
        r = info.context  # type: WSGIRequest
        if r.headers.get('authorization'):
            try:
                address = jwt.decode(r.headers.get('authorization', ''), settings.SECRET_KEY, algorithms="HS256")['address']
                if address:
                    info.context.profile, _ = Profile.objects.get_or_create(address=address)
            except Exception as e:
                logging.exception(e)
        return next_(root, info, *args, **kwargs)


class LoggingMiddleware:
    def resolve(self, next_, root, info, *args, **kwargs):
        try:
            return next_(root, info, *args, **kwargs)
        except Exception as e:
            if not isinstance(e, GraphQLError):
                logging.exception(e)
            raise e
