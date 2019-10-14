const hostsListUrl =
  "https://block.energized.pro/spark/formats/domains.txt"

const patternsListUrl =
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_general_block.txt"

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

  let urlsToBlock = hostsArray.concat(patternsArray)
  console.log(`${urlsToBlock.length} hosts will be blocked`)

  chrome.webRequest.onBeforeRequest.addListener(
    requestDetails => {
      console.log(requestDetails.url)
      return { cancel: true }
    },
    { urls: urlsToBlock },
    ["blocking"],
  )
}

fetchListsAndEnableAdBlocking()
