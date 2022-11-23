from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer,ProfileSerializer,PostSerializer,CommentSerializer
from .models import Profile, Post, Comment

class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

class ProfileViewSet(viewsets.ModelViewSet):
    # モデルデータを取得
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    # モデルデータを新規作成時に呼ぶ
    def perform_create(self, serializer):
        # 現在ログインしているユーザ情報をprofileUserに保存する
        serializer.save(profileUser=self.request.user)

class MyProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    # クエリセットを取得
    def get_queryset(self):
        #  ログインしているユーザだけを取得
        return self.queryset.filter(profileUser=self.request.user)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(postUser=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(commentUser=self.request.user)