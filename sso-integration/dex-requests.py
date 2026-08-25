#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
from html.parser import HTMLParser
from urllib.parse import urljoin
from urllib.request import urlopen

external_url = os.environ.get("DEX_EXTERNAL_URL", "http://dex:5556").rstrip("/")


def externalize(url):
    if url.startswith("http://dex:5556"):
        return external_url + url[len("http://dex:5556"):]
    return url


class DexPageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.form_action = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "a" and values.get("href"):
            self.links.append(values["href"])
        elif tag == "form" and values.get("action") and self.form_action is None:
            # Dex renders the credentials form first; keep that one even if the
            # page grows additional forms later.
            self.form_action = values["action"]


def parse_page(url):
    parser = DexPageParser()
    with urlopen(url) as response:
        parser.feed(response.read().decode("utf-8"))
    return parser


# Log in to Your Account via OpenLDAP Connector
page = parse_page(externalize(sys.argv[1]))
if len(page.links) < 2:
    sys.exit("dex connector page listed {} link(s); expected the OpenLDAP connector "
             "as the second one".format(len(page.links)))
page = parse_page(urljoin(external_url + "/", page.links[1]))
if not page.form_action:
    sys.exit("dex login page carried no form action")
print(urljoin(external_url + "/", page.form_action))
