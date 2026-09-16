def reference_features(data):

    return {

        "NoOfExternalRef": data.noOfExternalRef,

        "NoOfSelfRef": data.noOfSelfRef,

        "NoOfEmptyRef": data.noOfEmptyRef,

        "NoOfURLRedirect": data.noOfURLRedirect,

        "HasSocialNet": data.hasSocialNet,

        "HasCopyrightInfo": data.hasCopyrightInfo,

        "Robots": data.robots,

        "IsResponsive": data.isResponsive

    }