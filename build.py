#!/usr/bin/env python3
"""Packs HOME//OS for Samsung TVs: home-os-tv.wgt (unsigned; TizenBrew Installer signs it for your TV).

    python3 build.py
"""
import os
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'home-os-tv.wgt')


def main():
    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
        z.write(os.path.join(ROOT, 'tizen', 'config.xml'), 'config.xml')
        z.write(os.path.join(ROOT, 'tizen', 'icon.png'), 'icon.png')
        web = os.path.join(ROOT, 'web')
        for base, _, files in os.walk(web):
            for name in sorted(files):
                path = os.path.join(base, name)
                z.write(path, os.path.relpath(path, web))
    print('Built home-os-tv.wgt (%d KB)' % (os.path.getsize(OUT) // 1024))


if __name__ == '__main__':
    main()
