//Background script for the extension
var sso = [];
var page = '';
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  sso = request;
  page = sender.url;
  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  window.requestFileSystem(window.PERSISTENT, 5*1024*1024, onInitFs);
});

function onInitFs(fs) {
  var url = '';
  fs.root.getFile('top-80k.txt', {create: true}, function(fileEntry) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {
      fileWriter.onwriteend = function(e) {
        console.log('Write completed.' + url);
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };
      fileWriter.seek(fileWriter.length);
      if(sso.length > 0){
        var blob = new Blob([JSON.stringify({page, sso})], {type: 'text/plain'});
        fileWriter.write(blob);
      }
    });
    url = fileEntry.toURL();
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
      if(message.message == 'getURL'){
        sendResponse(url);
      }
    });
  });
}
