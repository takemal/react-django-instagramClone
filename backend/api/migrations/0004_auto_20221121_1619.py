# Generated by Django 3.1 on 2022-11-21 07:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20221118_2221'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='created_on',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='profile',
            old_name='created_on',
            new_name='created_at',
        ),
    ]
