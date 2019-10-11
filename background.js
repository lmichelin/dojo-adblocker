const hostsListUrl =
  "https://block.energized.pro/spark/formats/domains.txt"

fetch(hostsListUrl)
  .then(response => response.text())
  .then(responseText => {
    let hostsToBlock = responseText.split("\n").filter(line => !line.startsWith("#"))
    console.log(`${hostsToBlock.length} hosts will be blocked`)
  })

chrome.webRequest.onBeforeRequest.addListener(
  requestDetails => {
    console.log(requestDetails.url)
  },
  { urls: ["<all_urls>"] },
)
