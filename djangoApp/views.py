from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from .serializers import DocumentSerializer
from django.http import JsonResponse, Http404, HttpResponseForbidden
from rest_framework import authentication, permissions
from .models import Document, Keyword
from django.core.exceptions import PermissionDenied
from datetime import datetime
from .tasks import create_keywords
from rest_framework.decorators import action
from collections import Counter
# Create your views here.

class DocumentList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        data = JSONParser().parse(request)
        data['Author'] = request.user.id
        serializer = DocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            create_keywords.delay(data['Title'], data['Text'])
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class DocumentSingle(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def mycheck(self, pk):
        try:
            return Document.objects.get(id=pk)
        except Document.DoesNotExist:
            raise Http404

    def checkauthor(self, request, doc):
        if not request.user == doc.Author:
            raise PermissionDenied

    # @action(detail = True,permission_classes=[permissions.AllowAny])
    def get(self, request, *args, **kwargs):
        doc = self.mycheck(kwargs['pk'])
        serializer = DocumentSerializer(doc)
        return JsonResponse(serializer.data)

    @action(detail = True,permission_classes = [permissions.IsAuthenticated])
    def put(self, request, *args, **kwargs):
        doc = self.mycheck(kwargs['pk'])
        self.checkauthor(request, doc)
        data = JSONParser().parse(request)
        if not 'Title' in data.keys():
            data['Title'] = doc.Title.lower()
        if not 'Text' in data.keys():
            data['Text'] = doc.Text.lower()
        data['Author'] = request.user.id
        data['Update_Datetime'] = datetime.now()
        serializer = DocumentSerializer(doc, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    @action(detail = True,permission_classes = [permissions.IsAuthenticated])
    def delete(self, request, pk):
        doc = self.mycheck(pk)
        doc.delete()
        return JsonResponse({}, status=204)

class SearchApi(APIView):
    def get(self, request):
        query = request.GET['query'].lower()

        Qkeys = Counter()
        data = query.split()
        n = len(data)
        Qkeys += Counter(data)
        Qkeys += Counter([data[i] + " " + data[i+1] for i in range(n-1)])
        Qkeys += Counter([data[i] + " " + data[i+1] + " " + data[i+2] for i in range(n-2)])
        print(Qkeys)

        recorded_Qkeys = {}
        for k in Qkeys.keys():
            try :
                kw = Keyword.objects.get(Word = k)
                recorded_Qkeys[k] = kw.id
            except : 
                pass

        return JsonResponse(recorded_Qkeys)            



