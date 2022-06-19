from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from .serializers import DocumentSerializer
from django.http import JsonResponse, Http404, HttpResponseForbidden
from rest_framework import authentication, permissions
from .models import Document
from django.core.exceptions import PermissionDenied
from datetime import datetime
# Create your views here.

class DocumentList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        data = JSONParser().parse(request)
        data['Author'] = request.user.id
        serializer = DocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class DocumentSingle(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def mycheck(self, pk):
        try:
            return Document.objects.get(id=pk)
        except Document.DoesNotExist:
            raise Http404

    def checkauthor(self, request, doc):
        if not request.user == doc.Author:
            raise PermissionDenied

    def get(self, request, *args, **kwargs):
        doc = self.mycheck(kwargs['pk'])
        serializer = DocumentSerializer(doc)
        return JsonResponse(serializer.data)

    def put(self, request, *args, **kwargs):
        doc = self.mycheck(kwargs['pk'])
        self.checkauthor(request, doc)
        data = JSONParser().parse(request)
        if not 'Title' in data.keys():
            data['Title'] = doc.Title
        if not 'Text' in data.keys():
            data['Text'] = doc.Text
        data['Author'] = request.user.id
        data['Update_Datetime'] = datetime.now()
        serializer = DocumentSerializer(doc, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, pk):
        doc = self.mycheck(pk)
        doc.delete()
        return JsonResponse({}, status=204)

