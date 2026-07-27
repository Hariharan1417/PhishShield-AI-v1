from urllib.parse import urlparse
import re

def extract_features(data):

    parsed = urlparse(data.url)

    domain = parsed.netloc

    # Is Domain an IP?
    is_domain_ip = 1 if re.match(r"^\d+\.\d+\.\d+\.\d+$", domain) else 0

    features = [
    len(data.url),                         # URLLength
    len(domain),                           # DomainLength
    is_domain_ip,                          # IsDomainIP
    max(0, len(domain.split(".")) - 2),    # NoOfSubDomain
    1 if parsed.scheme == "https" else 0,  # IsHTTPS
    1 if data.title else 0,                # HasTitle
    data.hasFavicon,                       # HasFavicon
    1 if data.passwordFields > 0 else 0,   # HasPasswordField
    data.hasHiddenFields,                  # HasHiddenFields
    data.hasSubmitButton,                  # HasSubmitButton
    data.hasExternalFormSubmit,            # HasExternalFormSubmit
    data.noOfPopup                         # NoOfPopup
]
    print({
    "url": data.url,
    "features": features,
    "hasFavicon": data.hasFavicon,
    "hasHiddenFields": data.hasHiddenFields,
    "hasSubmitButton": data.hasSubmitButton,
    "hasExternalFormSubmit": data.hasExternalFormSubmit,
    "passwordFields": data.passwordFields
})

    return features