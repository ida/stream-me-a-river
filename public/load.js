function loadJson(path, callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', path, true);
  xobj.onreadystatechange = function () {
//console.log('readyState:', xobj.readyState, 'status:', xobj.status)
    if(xobj.readyState == "4") {
      if(xobj.status == "200") {
        callback(xobj.responseText);
      } else {
        let statusText = xobj.statusText
        if(statusText == 'Not Found') {
          statusText = "Couldn't find "
        }
        console.error(statusText, xobj.responseURL, '(' + xobj.status + ')')
      }
    }
  }
  xobj.send(null);  
}

