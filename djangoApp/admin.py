from django.contrib import admin
from .models import Document, History, Keyword, TrendingDocument

# Register your models here.
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'Title', 'Text', 'Creation_Datetime', 'Update_Datetime', 'Author']
admin.site.register(Document, DocumentAdmin)

class KeywordAdmin(admin.ModelAdmin):
    list_display = ['id', 'Word', 'Count_Doc']
admin.site.register(Keyword, KeywordAdmin)

class HistoryAdmin(admin.ModelAdmin):
    list_display = ['Doc', 'Read_by', 'DateandTime', 'SearchQuery']
admin.site.register(History, HistoryAdmin)

class TrendingAdmin(admin.ModelAdmin):
    list_display = ['Doc', 'Clicks_quarter1', 'Clicks_quarter2', 'Clicks_quarter3', 'Clicks_quarter4', 'Clicks_total']
admin.site.register(TrendingDocument, TrendingAdmin)