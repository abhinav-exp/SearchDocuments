# Generated by Django 4.0.5 on 2022-06-20 00:16

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('djangoApp', '0002_alter_document_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='Creation_Datetime',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='document',
            name='Update_Datetime',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='history',
            name='DateandTime',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now),
        ),
    ]
