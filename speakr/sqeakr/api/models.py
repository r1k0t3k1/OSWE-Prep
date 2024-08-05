from django.db import models
import uuid
# Create your models here.



class UserProfile(models.Model):
    username = models.CharField(max_length=100, unique=True, blank=False)
    password = models.CharField(max_length=64, blank=False)
    userid = models.UUIDField(unique=True, default=uuid.uuid4)
    firstname = models.CharField(max_length=64)
    lastname = models.CharField(max_length=64)
    bio = models.CharField(max_length=256)
    email = models.EmailField(max_length=64)
    location = models.CharField(max_length=64)
    avatar = models.CharField(max_length=64)

    def json(self):
        return {
            'id':self.id, 
            'username':self.username,
            'firstname':self.firstname,
            'lastname':self.lastname,
            'bio':self.bio,
            'email':self.email,
            'location':self.location,
            'userid':self.userid,
            'avatar':self.avatar
        }

    def slimjson(self):
        return {
            'id':self.id, 
            'username':self.username,
            'firstname':self.firstname,
            'lastname':self.lastname,
            'userid':self.userid,
            'avatar':self.avatar
        }


class Like(models.Model):
    sqeak = models.ForeignKey("Sqeak", on_delete=models.CASCADE)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    active = models.BooleanField()

    def json(self):
        return {
            'id':self.id,
            'active': self.active,
            'owner': self.owner.json()
        }

class Sqeak(models.Model):
    sqeak_text = models.CharField(max_length=256)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    created_date = models.DateTimeField()
    likes = models.ManyToManyField(UserProfile,related_name="owner", blank=True, through=Like)

    def json(self):
       
        return {
            'id': self.id,
            'sqeak_text': self.sqeak_text,
            'owner': self.owner.json(),
            'like_count': self.likes.filter(like__active=True).count(),
            'likes': [l.slimjson() for l in self.likes.filter(like__active=True)[:10]],
            'is_liked':False,
            'created_date': str(self.created_date)
        }


