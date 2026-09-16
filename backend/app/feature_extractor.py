from .feature_pipeline_v3 import build_feature_vector


FEATURE_ORDER = [

    "URLLength",
    "DomainLength",
    "IsDomainIP",
    "URLSimilarityIndex",
    "CharContinuationRate",
    "TLDLegitimateProb",
    "URLCharProb",
    "TLDLength",
    "NoOfSubDomain",

    "HasObfuscation",
    "NoOfObfuscatedChar",
    "ObfuscationRatio",

    "NoOfLettersInURL",
    "LetterRatioInURL",
    "NoOfDegitsInURL",
    "DegitRatioInURL",
    "NoOfOtherSpecialCharsInURL",
    "SpacialCharRatioInURL",

    "IsHTTPS",

    "HasTitle",
    "HasFavicon",
    "HasDescription",
    "HasPasswordField",
    "HasHiddenFields",
    "HasSubmitButton",
    "HasExternalFormSubmit",
    "NoOfPopup",
    "NoOfiFrame",

    "NoOfExternalRef",
    "NoOfSelfRef",
    "NoOfEmptyRef",
    "NoOfURLRedirect",

    "HasSocialNet",
    "HasCopyrightInfo",
    "Robots",
    "IsResponsive",

    "DomainTitleMatchScore",
    "URLTitleMatchScore"
]


def extract_features(data):

    feature_dict = build_feature_vector(data)

    print("\n========== V3 FEATURE VECTOR ==========")

    features = []

    for name in FEATURE_ORDER:

        value = feature_dict.get(name, 0)

        features.append(value)

        print(f"{name:<30} : {value}")

    print("\nTotal Features:", len(features))

    return features