from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView

from app.views import metadata_view

urlpatterns = [
    path('_meta/<str:uuid>', metadata_view),
    path('graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
