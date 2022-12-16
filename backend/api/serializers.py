from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Post, Comment
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        # アクティブなユーザモデルを取得。(カスタマイズした場合)
        model = get_user_model()
        fields = ('id','email','password')
        # パスワードは書込のみ可
        extra_kwargs= {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    # 書き込みのみ可にする
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    class Meta:
        model=Profile
        fields = ('id', 'nickName', 'profileUser', 'created_at', 'img')
        # ログインユーザを自動検出させるため、読込のみ可
        extra_kwargs = {'profileUser': {'read_only': True}}


class PostSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    class Meta:
        model = Post
        fields = ('id', 'title', 'postUser', 'created_at', 'img','likedUser')
        extra_kwargs = {'postUser': {'read_only': True}}

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'commentUser','post')
        extra_kwargs = {'commentUser': {'read_only': True}}