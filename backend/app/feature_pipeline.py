from .url_features import *
from .character_features import *
from .obfuscation_features import *
from .similarity_engine import url_similarity
from .tld_engine import tld_probability
from .entropy_engine import url_entropy
from .html_features import html_features
from .reference_features import reference_features
from .title_features import title_match


class FeaturePipeline:

    def __init__(self):
        pass

    def from_browser(self, data):
        raise NotImplementedError

    def from_dataset(self, row):
        raise NotImplementedError