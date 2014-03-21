var currentlyOn = false;

function listenForMessage(from,subject,fn){
	chrome.runtime.onMessage.addListener(function(msg, sender) {
	  console.log(msg);
	  if (msg.from && (msg.from === from)
			  && msg.subject && (msg.subject === subject)) {
		  fn(msg.content);
	  }
	});
}

function sendMessage(to, subject, content){
  if (to === "content"){
	var msg = {from: "background", subject: subject, content: content};
	console.log(msg);
    chrome.tabs.query({windowType: "normal"}, function(tabs){
	  console.log("Sending to "+tabs.length+" tabs.");
      for (i =0; i<tabs.length; i++){
        chrome.tabs.sendMessage(tabs[i].id, msg); 
      }
    });
  }
}

(function() {
	
  /* HANDLE OPENING AND CLOSING MAINPANEL STUFF */
  var panelWindow = undefined;

  function openMainPanel(hide) {
    // check if panel is already open
    if (typeof panelWindow == 'undefined' || panelWindow.closed) {

      chrome.windows.create({
		  url: chrome.extension.getURL('pages/mainpanel.html'), 
          width: 500, height: 800, left: 0, top: 0, 
          focused: true,
          type: 'panel'
          }, 
          function(winInfo) {panelWindow = winInfo;}
      );
    } else {
      chrome.windows.update(panelWindow.id, {focused: true});
    }
  }

  chrome.browserAction.onClicked.addListener(function(tab) {
    if (!currentlyOn){
      openMainPanel();
    }
    currentlyOn = !currentlyOn;
    console.log("currently on: "+currentlyOn);
    sendMessage("content","currentlyOn", currentlyOn);
  });
  
  chrome.windows.onRemoved.addListener(function(winId) {
    if (typeof panelWindow == 'object' && panelWindow.id == winId) {
      panelWindow = undefined;
    }
  });
  
  /* END HANDLE OPENING AND CLOSING MAINPANEL STUFF */
  
  listenForMessage("content","requestCurrentlyOn",function(){sendMessage("content","currentlyOn", currentlyOn);});

  //uncomment line below to automatically open mainpanel on browser open
  //openMainPanel();
  
  
})();

