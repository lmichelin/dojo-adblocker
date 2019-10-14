document.getElementById("toggleAdBlocking").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "toggleAdBlocking" }, response => {
    document.getElementById("adBlockingState").innerHTML = response
  })
})
