from celery import shared_task
from collections import Counter
from .models import Keyword

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
    
    print(ans)
    return ans

@shared_task
def create_keywords(title, text):
    new_counter = extract_keywords(title, text)
    print(new_counter)
    for k in new_counter.keys():
        try:
            kw = Keyword.objects.get(Word = k)
            kw.Count_Doc = kw.Count_Doc + 1
            kw.save()
        except : 
            kw = Keyword.objects.create(Word = k, Count_Doc = 1)
            kw.save()
        
        
