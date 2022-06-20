from django.urls import path
from .views import DocumentList, DocumentSingle, SearchApi
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('document/', DocumentList.as_view()),
    path('document/<int:pk>/', DocumentSingle.as_view()),
    path('search/', SearchApi.as_view()),
]

# urlpatterns = format_suffix_patterns(urlpatterns)