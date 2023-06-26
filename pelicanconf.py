AUTHOR = 'John Braun'
SITENAME = "John Braun // Blog"
SITE_URL = ''
PATH = 'content'
TIMEZONE = 'Europe/Amsterdam'
DEFAULT_LANG = 'en'
THEME = "themes/nice-blog"
DEFAULT_DATE_FORMAT="%d-%m-%Y"
# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
COPYRIGHT = "John Braun"
STATIC_PATHS = ['images', 'extra']
EXTRA_PATH_METADATA = {
    'extra/favicon.ico': {
        'path': 'favicon.ico'
    },
    'extra/robots.txt': {
        'path': 'robots.txt'
    },
}

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
