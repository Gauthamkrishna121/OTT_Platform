from rest_framework import serializers
from .models import Video, Series, Episode, WatchHistory, Comment

class WatchHistorySerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = WatchHistory
        fields = ['id', 'user', 'video', 'episode', 'progress', 'title', 'date']

    def get_title(self, obj):
        if obj.video:
            return obj.video.title
        if obj.episode:
            return f"{obj.episode.series.title} - {obj.episode.title}"
        return "Unknown"

    def get_date(self, obj):
        # Return format like "Oct 24, 2023"
        return obj.last_watched.strftime("%b %d, %Y")


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'video_file', 'thumbnail', 'genre', 'rating', 'uploaded_at', 'is_movie']


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    video = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'video', 'text', 'created_at']


class VideoDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    recommendations = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'video_file', 'thumbnail', 'genre', 'rating', 'uploaded_at', 'is_movie', 'comments', 'recommendations']

    def get_recommendations(self, obj):
        # Simple recommendation: other videos with same genre, limited to 5
        qs = Video.objects.filter(genre=obj.genre).exclude(id=obj.id)[:5]
        return VideoSerializer(qs, many=True).data

class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = ['id', 'series', 'title', 'video_file', 'episode_number']

class SeriesSerializer(serializers.ModelSerializer):
    episodes = EpisodeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Series
        fields = ['id', 'title', 'description', 'thumbnail', 'genre', 'rating', 'uploaded_at', 'episodes']

