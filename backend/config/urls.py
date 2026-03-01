from django.contrib import admin
from django.urls import path,include
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

from videos import auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', auth_views.api_login, name='api_login'),
    path('api/signup/', auth_views.api_signup, name='api_signup'),
    path('api/logout/', auth_views.api_logout, name='api_logout'),
    path('api/check-auth/', auth_views.check_auth, name='check_auth'),
    path('videos/', include('videos.urls')), 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)