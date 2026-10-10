import re
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

TRACKING_PARAMS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "ref",
    "fbclid",
    "gclid",
}

UNSAFE_KEYWORDS = {
    "torrent",
    "piratebay",
    "crack",
    "keygen",
    "warez",
    "phishing",
    "malware",
    "xxx",
    "porn",
    "adult",
    "gambling",
    "casino",
    "betting",
}


def is_valid_url(url: str) -> bool:
    """Check if URL has a valid HTTP/HTTPS scheme and non-empty hostname."""
    if not url or not isinstance(url, str):
        return False
    parsed = urlparse(url.strip())
    return parsed.scheme in ("http", "https") and bool(parsed.netloc)


def is_safe_url(url: str) -> bool:
    """Filter out unsafe, adult, or pirated domains."""
    if not is_valid_url(url):
        return False
    url_lower = url.lower()

    for kw in UNSAFE_KEYWORDS:
        if kw in url_lower:
            return False

    return True


def canonicalize_url(url: str) -> str:
    """
    Canonicalize a URL for consistent deduplication:
    - Lowercase scheme and netloc.
    - Remove default ports (:80 for http, :443 for https).
    - Normalize path slashes and trailing slashes.
    - Strip tracking query parameters.
    - Drop fragment identifiers.
    """
    if not url or not is_valid_url(url):
        return url.strip() if url else ""

    parsed = urlparse(url.strip())
    scheme = parsed.scheme.lower()
    netloc = parsed.netloc.lower()

    if netloc.endswith(":80") and scheme == "http":
        netloc = netloc[:-3]
    elif netloc.endswith(":443") and scheme == "https":
        netloc = netloc[:-4]

    path = parsed.path
    if path:
        path = re.sub(r"/+", "/", path)
        if len(path) > 1 and path.endswith("/"):
            path = path[:-1]
    else:
        path = "/"

    if parsed.query:
        query_params = parse_qsl(parsed.query, keep_blank_values=True)
        filtered_params = [
            (k, v) for k, v in query_params if k.lower() not in TRACKING_PARAMS
        ]
        query = urlencode(filtered_params)
    else:
        query = ""

    return urlunparse((scheme, netloc, path, parsed.params, query, ""))
