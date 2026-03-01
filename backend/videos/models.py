from django.db import models

class ContentBase(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True, null=True)
    rating = models.CharField(max_length=10, blank=True, null=True)
    # New metadata fields
    language = models.CharField(max_length=100, blank=True, null=True, default='English')
    release_year = models.PositiveIntegerField(blank=True, null=True)
    duration = models.CharField(max_length=20, blank=True, null=True, help_text="e.g. 2h 30m")
    cast = models.TextField(blank=True, null=True, help_text="Comma-separated list of cast members")
    director = models.CharField(max_length=255, blank=True, null=True)
    subtitles = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated subtitle languages")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.title

class Video(ContentBase):
    video_file = models.FileField(upload_to='videos/')
    is_movie = models.BooleanField(default=True)

class Series(ContentBase):
    pass

class Episode(models.Model):
    series = models.ForeignKey(Series, related_name='episodes', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    video_file = models.FileField(upload_to='episodes/')
    episode_number = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.series.title} - S01E{self.episode_number} - {self.title}"

class WatchHistory(models.Model):
    user = models.ForeignKey('auth.User', related_name='watch_history', on_delete=models.CASCADE)
    video = models.ForeignKey(Video, related_name='watch_history', on_delete=models.CASCADE, null=True, blank=True)
    episode = models.ForeignKey(Episode, related_name='watch_history', on_delete=models.CASCADE, null=True, blank=True)
    progress = models.CharField(max_length=10, default="0%")  # e.g., '85%'
    last_watched = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_watched']

    def __str__(self):
        title = self.video.title if self.video else self.episode.title if self.episode else "Unknown"
        return f"{self.user.username} - {title} - {self.progress}"


class Comment(models.Model):
    user = models.ForeignKey('auth.User', related_name='comments', on_delete=models.CASCADE)
    video = models.ForeignKey(Video, related_name='comments', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.user.username} on {self.video.title}"