from django.http import HttpRequest, JsonResponse
from django.shortcuts import render, get_object_or_404

from app.models import Artwork


def metadata_view(request: HttpRequest, uuid: str):
    token = get_object_or_404(Artwork, uuid=uuid)
    return JsonResponse({
        'name': token.title,
        'description': token.description,
        'image': request.build_absolute_uri(token.artwork),
        'external_url': request.build_absolute_uri(f'/artworks/{token.uuid}'),
    })
