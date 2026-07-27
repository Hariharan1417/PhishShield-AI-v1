const host = window.location.hostname;

if (host === "localhost" || host === "127.0.0.1") {
  console.log("Skipping localhost page.");
} else {
  console.log("🛡️ PhishShield AI Started");

  // ----------------------
  // Collect Page Info
  // ----------------------

  const pageInfo = {
    url: window.location.href,
    title: document.title,
    protocol: window.location.protocol,

    forms: document.forms.length,
    passwordFields: document.querySelectorAll("input[type='password']").length,
    emailFields: document.querySelectorAll("input[type='email']").length,
    links: document.links.length,

    hasFavicon:
      document.querySelector("link[rel*='icon']") ? 1 : 0,

    hasHiddenFields:
      document.querySelectorAll("input[type='hidden']").length > 0 ? 1 : 0,

    hasSubmitButton:
      document.querySelectorAll(
        "input[type='submit'], button[type='submit']"
      ).length > 0
        ? 1
        : 0,

    hasExternalFormSubmit:
      [...document.forms].some((form) => {
        const action = form.getAttribute("action");

        return (
          action &&
          action.startsWith("http") &&
          !action.includes(window.location.hostname)
        );
      })
        ? 1
        : 0,

    noOfPopup: 0,
  };

  console.table(pageInfo);

  // ----------------------
  // Create Banner
  // ----------------------

  const banner = document.createElement("div");

  banner.innerText = "🛡️ PhishShield AI | Analyzing Website...";

  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.background = "#0f172a";
  banner.style.color = "white";
  banner.style.padding = "12px";
  banner.style.textAlign = "center";
  banner.style.fontSize = "16px";
  banner.style.fontWeight = "bold";
  banner.style.whiteSpace = "pre-line";
  banner.style.zIndex = "999999";

  document.body.prepend(banner);

  // ----------------------
  // Send Request
  // ----------------------

  fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pageInfo),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "Safe") {
        banner.style.background = "#15803d";
      } else if (data.status === "Suspicious") {
        banner.style.background = "#ca8a04";
      } else {
        banner.style.background = "#dc2626";
      }

      let reasonsText = "";

      if (data.reasons?.length) {
        reasonsText = data.reasons
          .map((reason) =>
            reason.type === "positive"
              ? "✔ " + reason.message
              : "⚠ " + reason.message
          )
          .join("\n");
      }

      banner.innerText = `${
        data.status === "Safe"
          ? "🟢"
          : data.status === "Suspicious"
          ? "🟡"
          : "🔴"
      } ${data.status} Website

Risk Score : ${data.riskScore}
Source : ${data.source}

${reasonsText}`;
    })
    .catch((error) => {
      console.error(error);

      banner.style.background = "#dc2626";

      banner.innerText = `❌ Backend Connection Failed

Unable to connect to FastAPI Server.`;
    });
}