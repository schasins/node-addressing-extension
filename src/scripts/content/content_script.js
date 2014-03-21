var currentlyOn = false;

function listenForMessage(from,subject,fn){
  chrome.extension.onMessage.addListener(function(msg, sender) {
    console.log(msg);
    if (msg.from && (msg.from === from)
            && msg.subject && (msg.subject === subject)) {
        fn(msg.content);
    }
  });
}

function sendMessage(to, subject, content){
  var msg = {from: "content", subject: subject, content: content};
  console.log(msg);
  chrome.runtime.sendMessage(msg);
}

function setUp(){
  listenForMessage("background", "currentlyOn", function(msgContent){currentlyOn = msgContent;});
  sendMessage("background", "requestCurrentlyOn","");
}

$(setUp);

/*** HELPER FUNCTIONS ***/

function nodeToXPath(element) {
  //  we want the full path, not one that uses the id since ids can change
  //  if (element.id !== '')
  //    return 'id("' + element.id + '")';
  if (element.tagName.toLowerCase() === 'html'){
    return element.tagName;
  }

  // if there is no parent node then this element has been disconnected
  // from the root of the DOM tree
  if (!element.parentNode){
    return '';
  }

  var ix = 0;
  var siblings = element.parentNode.childNodes;
  for (var i = 0, ii = siblings.length; i < ii; i++) {
    var sibling = siblings[i];
    if (sibling === element){
      return nodeToXPath(element.parentNode) + '/' + element.tagName +
	     '[' + (ix + 1) + ']';
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName){
      ix++;
    }
  }
}

function xPathToNodes(xpath) {
  try {
    var q = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE,
                              null);
    var results = [];

    var next = q.iterateNext();
    while (next) {
      results.push(next);
      next = q.iterateNext();
    }
    return results;
  } catch (e) {
    console.log('xPath throws error when evaluated', xpath);
  }
  return [];
}
