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
	var msg = {from: "mainpanel", subject: subject, content: content};
	console.log(msg);
    chrome.tabs.query({windowType: "normal"}, function(tabs){
	  console.log("Sending to "+tabs.length+" tabs.");
      for (i =0; i<tabs.length; i++){
        chrome.tabs.sendMessage(tabs[i].id, msg); 
      }
    });
  }
}

function setUp(){
  console.log("Setting up.");
}

$(setUp);
