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


def free_file(name):
    """Commons image info for a file, if it is on Commons under a licence we may pack."""
    file = api('commons.wikimedia.org', titles='File:' + name, prop='imageinfo', iiprop='url|extmetadata', iiurlwidth=640, redirects=1)
    if not file.get('imageinfo'):
        return None, 'not on Commons'
    info = file['imageinfo'][0]
    licence = strip_tags((info.get('extmetadata', {}).get('LicenseShortName') or {}).get('value'))
    return (info, licence) if FREE.search(licence) else (None, 'licence ' + licence)


NOT_PHOTO = re.compile(r'\.(svg|gif)$|flag|logo|icon|emblem|map|seal|coat.of.arms|signature', re.I)


def licence_of(info):
    return strip_tags((info.get('extmetadata', {}).get('LicenseShortName') or {}).get('value'))


def commons_search(query):
    """Free bitmap images on Commons matching the query, best match first."""
    q = dict(action='query', format='json', formatversion=2, generator='search', gsrnamespace=6, gsrlimit=10,
             gsrsearch=query + ' filetype:bitmap', prop='imageinfo', iiprop='url|extmetadata', iiurlwidth=640)
    pages = get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(q)).get('query', {}).get('pages', [])
    for page in sorted(pages, key=lambda p: p.get('index', 99)):
        name = page['title'].split(':', 1)[1]
        info = (page.get('imageinfo') or [None])[0]
        if info and not NOT_PHOTO.search(name) and FREE.search(licence_of(info)):
            yield name, info


def photo_for(title, year, search=None):
    """The entry's own photo search if it has one; else the article's lead photo; else the best Commons match
    for the event; else another photo in the article."""
    title = urllib.parse.unquote(title)
    for name, info in commons_search(search) if search else ():
        return save(title, name, info)
    page = api('en.wikipedia.org', titles=title, prop='pageimages', piprop='name', redirects=1)
    lead = page.get('pageimage')
    if lead and not NOT_PHOTO.search(lead):
        info, why = free_file(lead)
        if info:
            return save(title, lead, info)
    topic = re.sub(r'\s*\(.*?\)', '', title.replace('_', ' '))
    for name, info in commons_search('%s %s' % (topic, year)):
        return save(title, name, info)
    for im in api('en.wikipedia.org', titles=title, prop='images', imlimit=40, redirects=1).get('images', [])[:12]:
        name = im['title'].split(':', 1)[1].replace(' ', '_')
        if not NOT_PHOTO.search(name):
            info, why = free_file(name)
            if info:
                return save(title, name, info)
    return None, 'no free photo'


def save(title, name, info):
    meta = info.get('extmetadata', {})
    licence = licence_of(info)
    url = info.get('thumburl') or info['url']
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower()
    ext = ext if ext in ('.jpg', '.jpeg', '.png', '.gif') else '.jpg'
    slug = re.sub(r'[^a-z0-9]+', '-', urllib.parse.quote(title).lower()).strip('-') + ext
    with open(os.path.join(OUT, slug), 'wb') as f:
        f.write(get(url, raw=True))
    artist = strip_tags((meta.get('Artist') or {}).get('value'))[:60]
    print('    ' + name)
    return {'src': 'photos/' + slug, 'credit': (artist + ' · ' if artist else '') + licence.upper()}, 'ok'


def main():
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(WEB, 'history.js'), encoding='utf-8') as f:
        entries = {}
        for line in reversed(f.read().splitlines()):
            m = re.search(r"y:\s*(-?\d+).*?wiki:\s*'([^']+)'", line)
            if m:
                search = re.search(r"photo:\s*'([^']+)'", line)
                entries[m.group(2)] = (m.group(1), search and search.group(1))
    photos = {}
    for t, (year, search) in sorted(entries.items()):
        try:
            p, why = photo_for(t, year, search)
        except Exception as e:  # a missing photo must never stop a release
            p, why = None, 'error ' + str(e)
        if p:
            photos[t] = p
        print(('+ ' if p else '- ') + t + ('' if p else ' (' + why + ')'))
        time.sleep(0.3)
    with open(os.path.join(WEB, 'photos.js'), 'w', encoding='utf-8') as f:
        f.write('/* Written by fetch_photos.py: freely licensed photos packed into the app. */\nvar PHOTOS = ')
        f.write(json.dumps(photos, ensure_ascii=False, indent=1, sort_keys=True))
        f.write(';\n')
    print('Packed %d of %d photos' % (len(photos), len(entries)))


if __name__ == '__main__':
    main()
