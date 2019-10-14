const hostsListUrl =
  "https://block.energized.pro/spark/formats/domains.txt"

const patternsListUrl =
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_general_block.txt"

let urlsToBlock = []
let blockedRequestsCount = 0
let isAdBlockingActive = true

const blockRequest = requestDetails => {
  console.log(requestDetails.url)

  blockedRequestsCount++
  chrome.browserAction.setBadgeText({ text: blockedRequestsCount.toString() })

  return { cancel: true }
}

const enableAdBlocking = () => {
  chrome.webRequest.onBeforeRequest.addListener(blockRequest, { urls: urlsToBlock }, ["blocking"])
  chrome.browserAction.setBadgeText({ text: blockedRequestsCount.toString() })
  isAdBlockingActive = true
}

const disableAdBlocking = () => {
  chrome.webRequest.onBeforeRequest.removeListener(blockRequest)
  chrome.browserAction.setBadgeText({ text: "off" })
  isAdBlockingActive = false
}

const fetchListsAndEnableAdBlocking = async () => {
  const hostsResponse = await fetch(hostsListUrl)
  const hostsResponseText = await hostsResponse.text()
  const hostsArray = hostsResponseText
    .split("\n")
    .filter(line => !line.startsWith("#"))
    .map(host => `*://${host}/*`)

  const patternsResponse = await fetch(patternsListUrl)
  const patternsResponseText = await patternsResponse.text()
  const patternsArray = patternsResponseText
    .split("\n")
    .filter(line => line !== "" && !line.startsWith("! "))
    .map(url => `*://*/*${url}*`)

  urlsToBlock = hostsArray.concat(patternsArray)

  console.log(`${urlsToBlock.length} hosts will be blocked`)

  enableAdBlocking()
}

fetchListsAndEnableAdBlocking()

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type === "toggleAdBlocking") {
    if (isAdBlockingActive) {
      disableAdBlocking()
      response("Désactivé")
    } else {
      enableAdBlocking()
      response("Activé")
    }
  }
})
