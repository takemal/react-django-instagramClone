
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # authen/でトークン認証
    path('authen/', include('djoser.urls.jwt')),
]
# urlにmedia用のリンクを設定
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)