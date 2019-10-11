chrome.webRequest.onBeforeRequest.addListener(
  requestDetails => {
    console.log(requestDetails.url)
  },
  { urls: ["<all_urls>"] },
)
