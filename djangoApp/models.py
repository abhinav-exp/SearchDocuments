from django.db import models
from datetime import datetime
from django.contrib.auth import get_user_model
from django.utils import timezone

# Create your models here.

User=get_user_model()

class Document(models.Model):
    id = models.AutoField(primary_key=True)
    Title = models.CharField(max_length = 500)
    Text = models.TextField()
    Creation_Datetime = models.DateTimeField(default=timezone.now, blank=True)
    Update_Datetime = models.DateTimeField(default=timezone.now, blank=True)
    Author = models.ForeignKey(User, on_delete = models.CASCADE)

class History(models.Model):
    Doc = models.ForeignKey(Document, models.CASCADE)
    Read_by = models.ForeignKey(User, models.CASCADE, null = True, blank = True)
    DateandTime = models.DateTimeField(default = timezone.now, blank = True)
    SearchQuery = models.CharField(max_length = 500)

class Keyword(models.Model):
    id = models.AutoField(primary_key = True)
    Word = models.CharField(max_length = 100)
    Count_Doc = models.BigIntegerField()

class TrendingDocument(models.Model):
    Doc = models.OneToOneField(Document, on_delete = models.CASCADE)
    Clicks_quarter1 = models.BigIntegerField(default = 0)
    Clicks_quarter2 = models.BigIntegerField(default = 0)
    Clicks_quarter3 = models.BigIntegerField(default = 0)
    Clicks_quarter4 = models.BigIntegerField(default = 0)
    Clicks_total = models.BigIntegerField(default = 0) 