from django.urls import path, re_path

from api.views import userviews
from api.views import sqeakviews
from api.views import avatarviews

urlpatterns = [
    path('login', userviews.login, name='login'),
    path('sqeaks', sqeakviews.get_sqeaks, name='get_sqeaks'),
    path('compose', sqeakviews.compose, name='compose'),
    path('register/new', userviews.profile_new, name='profile_new'),
    path('draft', sqeakviews.draft, name='draft'),
    path('profile', userviews.profile, name='profile'),
    path('profile/update', userviews.update_user_profile, name='update_profile'),
    path('profile/upload', avatarviews.upload_avatar, name='upload_avatar'),
    path('profile/preview/<img>', avatarviews.preview_avatar, name='preview_avatar'),
    path('profile/approve/<img>', avatarviews.approve_avatar, name='approve_avatar'),
    path('profile/password', userviews.update_password, name='update_password'),
    path('profile/<username>', userviews.get_user_profile, name='profile'),
    path('sqeak/<int:sqeak_id>', sqeakviews.get_sqeak, name='get_sqeak'),
    path('sqeak/<int:sqeak_id>/like', sqeakviews.like_sqeak, name='like_sqeak'),
    re_path('avatars/(?P<username>[\S]+)', avatarviews.get_avatars_for_username, name='get_avatars'),
    path('<username>', sqeakviews.get_sqeaks_by_username, name='sqeaks'),


]