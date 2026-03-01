from django.urls import path
from .views import video_list, video_detail, series_list, series_detail, add_episode, episode_detail, watch_history_list, video_comments

urlpatterns = [
    path('movies/', video_list, name='video_list'),
    path('movies/<int:pk>/', video_detail, name='video_detail'),
    path('series/', series_list, name='series_list'),
    path('series/<int:pk>/', series_detail, name='series_detail'),
    path('episodes/', add_episode, name='add_episode'),
    path('episodes/<int:pk>/', episode_detail, name='episode_detail'),
    path('history/', watch_history_list, name='watch_history_list'),
    path('movies/<int:pk>/comments/', video_comments, name='video_comments'),
]