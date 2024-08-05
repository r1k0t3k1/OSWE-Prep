from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.http import require_GET

def index(request):
    #return HttpResponse("Welcome to Sqeakr")
    #template = loader.get_template('main/index.html')
    return render(request, 'pages/index.html')

@require_GET
def robots_txt(request):
    lines = [
        'User-agent: *',
        'Disallow: /api/login',
        'Disallow: /api/register/',
        'Disallow: /api/compose',
        'Disallow: /api/draft',
        'Disallow: /api/profile/update',
        'Disallow: /api/profile/upload',
        'Disallow: /api/profile/preview/*',
        'Disallow: /api/profile/approve/*',
        'Disallow: /api/profile/password',
        'Disallow: /api/avatars/*',
        'Allow: /api/sqeaks',
        'Allow: /feed'
    ]

    return HttpResponse('\n'.join(lines), content_type='text/plain')