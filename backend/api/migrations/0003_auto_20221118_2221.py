# Generated by Django 3.1 on 2022-11-18 13:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20221118_2218'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='userComment',
            new_name='commentUser',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='liked',
            new_name='likedUser',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='userPost',
            new_name='postUser',
        ),
        migrations.RenameField(
            model_name='profile',
            old_name='userProfile',
            new_name='profileUser',
        ),
    ]