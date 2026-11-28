#!/usr/bin/env python3
import argparse
import concurrent.futures
from html.parser import HTMLParser
from urllib.parse import urlsplit
from urllib.request import urlopen
from xml.etree import ElementTree

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = []
        self.headings = 0

    def handle_starttag(self, tag, attributes):
        values = dict(attributes)
        if tag == 'h1':
            self.headings += 1
        if tag == 'link' and values.get('rel') == 'canonical':
            self.canonical.append(values.get('href'))

def normalized_url(url):
    if not url:
        return url
    parsed = urlsplit(url)
    return parsed._replace(path=parsed.path or "/").geturl()

def main():
    parser = argparse.ArgumentParser(description='Check sitemap pages via a local or deployed server')
    parser.add_argument('origin')
    origin = parser.parse_args().origin.rstrip('/')
    with urlopen(origin + '/sitemap.xml', timeout=20) as response:
        sitemap = ElementTree.fromstring(response.read())
    locations = [entry.text for entry in sitemap.findall('.//{*}loc') if entry.text]

    def check(url):
        try:
            with urlopen(origin + (urlsplit(url).path or "/"), timeout=20) as response:
                page = Page()
                page.feed(response.read().decode())
            if [normalized_url(value) for value in page.canonical] != [normalized_url(url)] or page.headings != 1:
                return f'{url}: canonical={page.canonical}, H1 count={page.headings}'
        except (OSError, ValueError) as error:
            return f'{url}: {error}'

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        issues = [issue for issue in pool.map(check, locations) if issue]
    if not locations:
        issues.append('Sitemap contains no indexable URLs')
    if len(set(locations)) != len(locations):
        issues.append('Sitemap contains duplicate URLs')
    for issue in issues:
        print(issue)
    print(f'Checked {len(locations)} URLs, {len(issues)} issue(s)')
    return bool(issues)

if __name__ == '__main__':
    raise SystemExit(main())
