from django.contrib import admin
from .models import Video, Series, Episode, WatchHistory, Comment

admin.site.register(Video)
admin.site.register(Series)
admin.site.register(Episode)
admin.site.register(WatchHistory)
admin.site.register(Comment)