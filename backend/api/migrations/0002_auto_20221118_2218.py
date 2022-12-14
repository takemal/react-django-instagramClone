# Generated by Django 3.1 on 2022-11-18 13:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='post_id',
            new_name='post',
        ),
        migrations.RenameField(
            model_name='comment',
            old_name='user_id',
            new_name='userComment',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='created_at',
            new_name='created_on',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='likeUser_id',
            new_name='liked',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='postUser_id',
            new_name='userPost',
        ),
        migrations.RenameField(
            model_name='profile',
            old_name='created_at',
            new_name='created_on',
        ),
        migrations.RenameField(
            model_name='profile',
            old_name='user_id',
            new_name='userProfile',
        ),
    ]
