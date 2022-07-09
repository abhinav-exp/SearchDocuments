from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from .serializers import DocumentSerializer
from django.http import JsonResponse, Http404, HttpResponseForbidden
from rest_framework import authentication, permissions
from .models import Document, Keyword, TrendingDocument
from django.core.exceptions import PermissionDenied
from datetime import datetime
from .tasks import create_keywords, update_keywords, delete_keywords, update_history
from rest_framework.decorators import action
from collections import Counter
from pymongo import MongoClient
from django.conf import settings
from django.http import FileResponse
import os
# Create your views here.

def favicon_view(request):
    file_path = os.path.join(settings.BASE_DIR, 'build', 'favicon.ico')
    file_obj = open(file_path, 'rb')
    response = FileResponse(file_obj)
    return response

def logo192_view(request):
    file_path = os.path.join(settings.BASE_DIR, 'build', 'logo192.png')
    file_obj = open(file_path, 'rb')
    response = FileResponse(file_obj)
    return response

class DocumentList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        data = [{"id": d.id, "Title" : d.Title, "Text": d.Text} for d in Document.objects.all().filter(Author = request.user).order_by('-id')]
        return JsonResponse({
            "list" : data
        })

    def post(self, request):
        data = JSONParser().parse(request)
        data['Author'] = request.user.id
        serializer = DocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            create_keywords.delay(data['Title'], data['Text'], serializer.data['id'])
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
            update_keywords.delay(data['Title'], data['Text'], doc.Title, doc.Text, doc.id)
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    @action(detail = True,permission_classes = [permissions.IsAuthenticated])
    def delete(self, request, pk):
        doc = self.mycheck(pk)
        delete_keywords.delay(doc.Title, doc.Text, doc.id)
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
        # print(Qkeys)

        recorded_Qkeys = {}
        for k in Qkeys.keys():
            try :
                kw = Keyword.objects.get(Word = k)
                recorded_Qkeys[k] = kw.id
            except : 
                pass

        # return JsonResponse(recorded_Qkeys)  4
        ans = []
        with MongoClient('mongodb://localhost:27017/') as connection:
            myCollection = connection.searchDocumentsDB.Maps
            for obj in Document.objects.all():
                temp = 0
                for text, index in recorded_Qkeys.items():
                    t = myCollection.find_one({"_id":obj.id, str(index) : {"$exists" : True}})
                    if not t == None:
                        temp += t[str(index)]
                if not temp == 0:
                    ans.append([temp, obj.id])
                if len(ans) > 10:
                    i = 0
                    for j in range(11):
                        if ans[j][0] < ans[i][0]:
                            i = j
                    del ans[i]
        ans.sort(reverse = True)
        return JsonResponse({"suggestion" : [v[1] for v in ans]})


class SearchClick(APIView):
    def get(self, request):
        try:
            pk = int(request.GET['doc'])
            doc = Document.objects.get(id=pk)
        except:
            raise Http404
        serializer = DocumentSerializer(doc)
        if not request.GET['query'] == "":
            if request.user.is_anonymous:
                update_history.delay(pk, sq = request.GET['query'], userid = 0)
            else :
                update_history.delay(pk, sq = request.GET['query'], userid = request.user.id)
        return JsonResponse({
            "Title" : serializer.data['Title'], 
            "Text" : serializer.data['Text']
        })

class Trends(APIView):
    def get(self, request):
        trends = []
        for obj in TrendingDocument.objects.all():
            trends.append([obj.Clicks_total, obj.Doc.id])
            if len(trends) > 10:
                min_i = 0
                for j in range(11):
                    if trends[min_i][0] > trends[j][0]:
                        min_i = j
                del trends[min_i]
        print(trends)
        trends.sort(reverse = True)
        print(trends)
        return JsonResponse({
            "trends" : [v[1] for v in trends]
        })
