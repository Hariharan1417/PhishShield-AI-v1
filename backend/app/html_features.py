def html_features(data):

    return {

        "HasTitle": 1 if data.title else 0,

        "HasDescription": data.hasDescription,

        "HasFavicon": data.hasFavicon,

        "HasPasswordField": 1 if data.passwordFields > 0 else 0,

        "HasHiddenFields": data.hasHiddenFields,

        "HasSubmitButton": data.hasSubmitButton,

        "HasExternalFormSubmit": data.hasExternalFormSubmit,

        "NoOfPopup": data.noOfPopup,

        "NoOfiFrame": data.noOfiFrame,

        "NoOfImage": data.noOfImage,

        "NoOfCSS": data.noOfCSS,

        "NoOfJS": data.noOfJS
    }