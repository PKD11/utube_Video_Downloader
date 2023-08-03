chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Send the message to your Python program using Native Messaging
  // The Native Messaging host will handle the video download process.
  const port = chrome.runtime.connectNative("your.native.messaging.host");
  port.postMessage({ url: message.url });

  // Listen for the response from the Native Messaging host (Python program)
  port.onMessage.addListener((response) => {
    console.log("Received response from Native Messaging host:", response);
    // Optionally, you can send a response back to the popup script if needed.
    // For example, you can inform the user that the download is complete or show an error message.
    sendResponse(response);
  });

  // Handle any errors that may occur during Native Messaging communication
  port.onDisconnect.addListener(() => {
    if (chrome.runtime.lastError) {
      console.error("Error connecting to Native Messaging host:", chrome.runtime.lastError);
    }
  });

  // IMPORTANT: You must return true here to indicate that you want to use sendResponse asynchronously.
  // If you don't return true, the sendResponse callback will be invalidated after this function returns,
  // and you won't be able to send a response back to the popup script.
  return true;
});
