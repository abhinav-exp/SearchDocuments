import os 
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'searchDocuments.settings')

app = Celery('searchDocuments')

app.config_from_object('django.conf:settings', namespace = 'CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'every-6-hours' : {
        'task' : 'djangoApp.tasks.remove_old_trends',
        'schedule' : crontab(hour = '*/6')
    }
}
