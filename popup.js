chrome.runtime.sendMessage({'message' : 'getURL'}, function(response){
  var elem = document.getElementsByClassName('download-link');
  elem[0].href = response;
});
