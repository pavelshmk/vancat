# Generated by Django 3.2.7 on 2021-09-23 13:52

from django.db import migrations, models
import django_extensions.db.fields
import sorl.thumbnail.fields
import uuid


class Migration(migrations.Migration):

    replaces = [('app', '0001_initial'), ('app', '0002_profile_avatar'), ('app', '0003_artwork'), ('app', '0004_auto_20210923_1539'), ('app', '0005_auto_20210923_1648'), ('app', '0006_alter_artwork_owner'), ('app', '0007_auto_20210923_1650'), ('app', '0008_delete_artworkevent'), ('app', '0009_artworkevent')]

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(db_index=True, max_length=64)),
                ('username', django_extensions.db.fields.RandomCharField(blank=True, editable=False, length=32, unique=True)),
                ('bio', models.TextField(default='')),
                ('instagram', models.CharField(default='', max_length=64)),
                ('twitter', models.CharField(default='', max_length=64)),
                ('facebook', models.CharField(default='', max_length=64)),
                ('telegram', models.CharField(default='', max_length=64)),
                ('avatar', sorl.thumbnail.fields.ImageField(blank=True, null=True, upload_to='avatars')),
            ],
        ),
        migrations.CreateModel(
            name='Artwork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64)),
                ('category', models.CharField(choices=[('games', 'Games'), ('art', 'Art'), ('photo', 'Photo'), ('music', 'Music')], max_length=8)),
                ('description', models.TextField()),
                ('artwork', models.FileField(upload_to='')),
                ('exclusive_info', models.TextField()),
                ('royalties', models.PositiveSmallIntegerField()),
                ('minter', models.CharField(db_index=True, max_length=64)),
                ('uuid', models.UUIDField(default=uuid.uuid4)),
                ('owner', models.CharField(blank=True, db_index=True, max_length=64, null=True)),
                ('token_id', models.PositiveBigIntegerField(blank=True, db_index=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ArtworkEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token_id', models.PositiveBigIntegerField(db_index=True, null=True)),
                ('datetime', models.DateTimeField(auto_now_add=True)),
                ('from_address', models.CharField(max_length=64)),
                ('to_address', models.CharField(max_length=64)),
                ('event', models.CharField(db_index=True, max_length=64)),
                ('data', models.JSONField()),
            ],
        ),
    ]
