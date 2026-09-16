from .url_features import (
    parse_url,
    is_ip,
    subdomain_count,
    tld_length
)

from .character_features import (
    count_letters,
    count_digits,
    count_special,
    letter_ratio,
    digit_ratio,
    special_ratio,
    unique_char_probability
)

from .obfuscation_features import (
    has_obfuscation,
    encoded_characters,
    obfuscation_ratio,
    continuation_rate
)

from .similarity_engine import url_similarity
from .entropy_engine import url_entropy
from .tld_engine import tld_probability
from .title_features import title_match
from .reference_features import reference_features


class FeaturePipelineV3:

    def __init__(self, data):

        self.data = data

        parsed = parse_url(data.url)

        self.url = parsed["url"]
        self.domain = parsed["domain"]
        self.path = parsed["path"]
        self.scheme = parsed["scheme"]

    # ======================================================
    # URL FEATURES
    # ======================================================

    def build_url_features(self):

        similarity = url_similarity(self.url)

        return {

            "URLLength": len(self.url),

            "DomainLength": len(self.domain),

            "IsDomainIP": is_ip(self.domain),

            "URLSimilarityIndex": similarity["score"],

            "CharContinuationRate": continuation_rate(self.url),

            "TLDLegitimateProb": tld_probability(self.domain),

            "URLCharProb": unique_char_probability(self.url),

            "TLDLength": tld_length(self.domain),

            "NoOfSubDomain": subdomain_count(self.domain),

            "IsHTTPS": 1 if self.scheme == "https" else 0
        }

    # ======================================================
    # CHARACTER + OBFUSCATION FEATURES
    # ======================================================

    def build_character_features(self):

        return {

            "HasObfuscation": has_obfuscation(self.url),

            "NoOfObfuscatedChar": encoded_characters(self.url),

            "ObfuscationRatio": obfuscation_ratio(self.url),

            "NoOfLettersInURL": count_letters(self.url),

            "LetterRatioInURL": letter_ratio(self.url),

            "NoOfDegitsInURL": count_digits(self.url),

            "DegitRatioInURL": digit_ratio(self.url),

            "NoOfOtherSpecialCharsInURL": count_special(self.url),

            "SpacialCharRatioInURL": special_ratio(self.url)
        }

    # ======================================================
    # HTML FEATURES
    # ======================================================

    def build_html_features(self):

        return {

            "HasTitle": 1 if self.data.title else 0,

            "HasFavicon": self.data.hasFavicon,

            "HasDescription": self.data.hasDescription,

            "HasPasswordField": (
                1 if self.data.passwordFields > 0 else 0
            ),

            "HasHiddenFields": self.data.hasHiddenFields,

            "HasSubmitButton": self.data.hasSubmitButton,

            "HasExternalFormSubmit": (
                self.data.hasExternalFormSubmit
            ),

            "NoOfPopup": self.data.noOfPopup,

            "NoOfiFrame": self.data.noOfiFrame
        }

    # ======================================================
    # REFERENCE FEATURES
    # ======================================================

    def build_reference_features(self):

        return reference_features(self.data)

    # ======================================================
    # TITLE FEATURES
    # ======================================================

    def build_title_features(self):

        score = title_match(
            self.domain,
            self.data.title
        )

        return {

            "DomainTitleMatchScore": score,

            "URLTitleMatchScore": score
        }

    # ======================================================
    # FINAL FEATURE VECTOR
    # ======================================================

    def build_feature_vector(self):

        features = {}

        features.update(
            self.build_url_features()
        )

        features.update(
            self.build_character_features()
        )

        features.update(
            self.build_html_features()
        )

        features.update(
            self.build_reference_features()
        )

        features.update(
            self.build_title_features()
        )

        return features


# ==========================================================
# PUBLIC FUNCTION
# ==========================================================

def build_feature_vector(data):

    pipeline = FeaturePipelineV3(data)

    return pipeline.build_feature_vector()