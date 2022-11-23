from django.urls import path, include
from .views import ProfileViewSet,PostViewSet,CommentViewSet,MyProfileListView,CreateUserView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('profile',ProfileViewSet)
router.register('post', PostViewSet)
router.register('comment', CommentViewSet)

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('myprofile/', MyProfileListView.as_view(), name='myprofile'),
    path('',include(router.urls))
]