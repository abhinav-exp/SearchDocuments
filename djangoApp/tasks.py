from celery import shared_task
from collections import Counter
from .models import Document, Keyword, History, TrendingDocument
import os
from pymongo import MongoClient
from bson.json_util import dumps, loads
from django.contrib.auth import get_user_model

User=get_user_model()


@shared_task
def add(x, y):
    return x+y

# @shared_task
def extract_keywords(title, text):
    ans = Counter()
    data = title.lower().split()
    n = len(data)
    ans += Counter(data)
    ans += Counter([data[i] + " " + data[i+1] for i in range(n-1)])
    ans += Counter([data[i] + " " + data[i+1] + " " + data[i+2] for i in range(n-2)])

    data = text.lower().split()
    n = len(data)
    ans += Counter(data)
    ans += Counter([data[i] + " " + data[i+1] for i in range(n-1)])
    ans += Counter([data[i] + " " + data[i+1] + " " + data[i+2] for i in range(n-2)])
    
    # print(ans)
    return ans

@shared_task
def create_keywords(title, text, lastid):
    new_counter = extract_keywords(title, text)
    mongodoc = {}
    # print(new_counter)
    for k, v in new_counter.items():
        try:
            kw = Keyword.objects.get(Word = k)
            kw.Count_Doc = kw.Count_Doc + 1
            kw.save()
            mongodoc[str(kw.id)] = v
        except : 
            kw = Keyword.objects.create(Word = k, Count_Doc = 1)
            kw.save()
            mongodoc[str(kw.id)] = v
    with MongoClient('mongodb://localhost:27017/') as connection:
        mydb = connection.searchDocumentsDB
        myCollection = mydb.Maps
        count = myCollection.count_documents({})
        # count1 = myCollection.find({}).count()
        # print("count1 = "+str(count1))
        # print("count = "+str(count))
        # print("lastid = "+str(lastid))
        while count <= lastid:
            myCollection.insert_one({'_id':count})
            count += 1
        myCollection.find_one_and_update({'_id':lastid}, {"$set":mongodoc})
        # print("vbyerigv")
        
@shared_task
def delete_keywords(title, text, optid):
    new_counter = extract_keywords(title, text)
    myDocJson = {}
    
    for k in new_counter.keys():
        kw = Keyword.objects.get(Word = k)
        kw.Count_Doc = kw.Count_Doc - 1
        kw.save()
        myDocJson[str(kw.id)] = ""
    
    with MongoClient('mongodb://localhost:27017/') as connection:
        mydb = connection.searchDocumentsDB
        myCollection = mydb.Maps
        myCollection.find_one_and_update({'_id': optid}, {"$unset" : myDocJson})

@shared_task
def update_keywords(title_new, text_new, title_old, text_old, optid):
    # print(title_new)
    counter_new = extract_keywords(title_new, text_new)
    counter_old = extract_keywords(title_old, text_old)
    to_be_sub = counter_old - counter_new
    to_be_add = counter_new - counter_old
    myDocJson = {}
    mongodoc = {}
    # print(to_be_sub)
    for k in to_be_sub.keys():
        kw = Keyword.objects.get(Word = k)
        kw.Count_Doc = kw.Count_Doc - 1
        kw.save()
        myDocJson[str(kw.id)] = ""
    for k, v in to_be_add.items():
        try : 
            kw = Keyword.objects.get(Word = k)
            kw.Count_Doc = kw.Count_Doc + 1
            kw.save()
            mongodoc[str(kw.id)] = v
        except : 
            kw = Keyword.objects.create(Word = k, Count_Doc = 1)
            kw.save()
            mongodoc[str(kw.id)] = v

    with MongoClient('mongodb://localhost:27017/') as connection:
        mydb = connection.searchDocumentsDB
        myCollection = mydb.Maps
        myCollection.find_one_and_update({'_id': optid}, {"$set":mongodoc, "$unset" : myDocJson})

@shared_task
def update_history(optid, sq, userid):
    doc = Document.objects.get(id = optid)
    if userid == 0:
        h = History.objects.create(Doc = doc, SearchQuery = sq)
        h.save()
    else:
        user = User.objects.get(id = userid)
        h = History.objects.create(Doc = doc, SearchQuery = sq, Read_by = user)
        h.save()

    try : 
        t = TrendingDocument.objects.get(Doc = doc)
        t.Clicks_quarter1 = t.Clicks_quarter1 + 1
        t.Clicks_total = t.Clicks_total + 1
        t.save()
    except:
        t = TrendingDocument.objects.create(Doc = doc, Clicks_quarter1 = 1, Clicks_total = 1)
        t.save()


    