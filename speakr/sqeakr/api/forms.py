from django import forms

class UploadAvatarForm(forms.Form):
    #filename = forms.CharField(max_length=64)
    file = forms.FileField()