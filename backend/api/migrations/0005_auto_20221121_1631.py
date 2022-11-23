# Generated by Django 3.1 on 2022-11-21 07:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20221121_1619'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='commentUser',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commentUser', to=settings.AUTH_USER_MODEL),
        ),
    ]
