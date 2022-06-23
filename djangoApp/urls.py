from django.urls import path
from .views import DocumentList, DocumentSingle, SearchApi, SearchClick, Trends
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('document/', DocumentList.as_view()),
    path('document/<int:pk>/', DocumentSingle.as_view()),
    path('search/', SearchApi.as_view()),
    path('click/', SearchClick.as_view()),
    path('trends/', Trends.as_view()),
]

# urlpatterns = format_suffix_patterns(urlpatterns)