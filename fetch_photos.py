#!/usr/bin/env python3
"""Packs an archival photo for each history date into the app, so the photo shows even when Wikipedia can't be reached.

For each `wiki:` article in web/history.js it takes the article's lead image from Wikimedia Commons,
keeps it only if Commons marks it public domain, CC0 or Creative Commons BY (credited on screen), and saves a 640px copy to web/photos/.
web/photos.js then lists them for the app. Runs in the release workflow; never fails the build.

    python3 fetch_photos.py
"""
import json
import os
import re
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(ROOT, 'web')
OUT = os.path.join(WEB, 'photos')
AGENT = 'HOME-OS-TV-build/1.0 (https://github.com/stevwya77/home-os-tv)'
FREE = re.compile(r'public domain|^pd\b|^pd-|cc0|^cc by', re.I)


def get(url, raw=False):
    req = urllib.request.Request(url, headers={'User-Agent': AGENT})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    return data if raw else json.loads(data)


def strip_tags(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s or '')).strip()


def api(host, **params):
    params.update(action='query', format='json', formatversion=2)
    return get('https://%s/w/api.php?%s' % (host, urllib.parse.urlencode(params)))['query']['pages'][0]


def photo_for(title):
    page = api('en.wikipedia.org', titles=urllib.parse.unquote(title), prop='pageimages', piprop='name', redirects=1)
    name = page.get('pageimage')
    if not name:
        return None, 'no lead image'
    file = api('commons.wikimedia.org', titles='File:' + name, prop='imageinfo', iiprop='url|extmetadata', iiurlwidth=640, redirects=1)
    if not file.get('imageinfo'):
        return None, 'lead image is not on Commons'
    info = file['imageinfo'][0]
    meta = info.get('extmetadata', {})
    licence = strip_tags((meta.get('LicenseShortName') or {}).get('value'))
    if not FREE.search(licence):
        return None, 'licence ' + licence
    url = info.get('thumburl') or info['url']
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower()
    ext = ext if ext in ('.jpg', '.jpeg', '.png', '.gif') else '.jpg'
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-') + ext
    with open(os.path.join(OUT, slug), 'wb') as f:
        f.write(get(url, raw=True))
    artist = strip_tags((meta.get('Artist') or {}).get('value'))[:60]
    return {'src': 'photos/' + slug, 'credit': (artist + ' · ' if artist else '') + licence.upper()}, 'ok'


def main():
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(WEB, 'history.js'), encoding='utf-8') as f:
        titles = sorted(set(re.findall(r"wiki:\s*'([^']+)'", f.read())))
    photos = {}
    for t in titles:
        try:
            p, why = photo_for(t)
        except Exception as e:  # a missing photo must never stop a release
            p, why = None, 'error ' + str(e)
        if p:
            photos[t] = p
        print(('+ ' if p else '- ') + t + ('' if p else ' (' + why + ')'))
        time.sleep(0.3)
    with open(os.path.join(WEB, 'photos.js'), 'w', encoding='utf-8') as f:
        f.write('/* Written by fetch_photos.py: public-domain photos packed into the app. */\nvar PHOTOS = ')
        f.write(json.dumps(photos, ensure_ascii=False, indent=1, sort_keys=True))
        f.write(';\n')
    print('Packed %d of %d photos' % (len(photos), len(titles)))


if __name__ == '__main__':
    main()
