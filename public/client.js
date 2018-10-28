var msgsEle = document.querySelector('#stream')
function getHeight(ele) {
  return parseFloat(getComputedStyle(ele).getPropertyValue('height'))
}
function addMsgEle(msg) {
  const msgEle = document.createElement('div')
  msgEle.innerHTML = msg
  msgsEle.insertBefore(msgEle, msgsEle.firstChild)
  let height = getHeight(msgEle)
  msgEle.style.height = '10px'
  msgEle.style.overflow = 'hidden'
  let increaseHeight = setInterval(function() {
    msgEle.style.height = getHeight(msgEle) + 1 + 'px'
    if(getHeight(msgEle) >= height + 33) { // 33 is for marge/padd?
      clearInterval(increaseHeight)
    }
  });
}

function loadJson(path, callback) {   

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', path, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}


function doAfterJsonLoaded(responseText) {
  let msgs = responseText
  msgs = JSON.parse(msgs)
  if(msgs.length < 1) {
    addMsgEle('<div class="post">Waiting for more messages ...<div class="meta">... your friendly streamer.</div></div>')
      setTimeout(function() {
       loadJson('msgs', doAfterJsonLoaded)
      }, 5000)
    return
  }
  addMsgEle(msgs.shift())
  const streamLoop = setInterval(function() {
    if(msgs.length < 2) {
      clearInterval(streamLoop)
      setTimeout(function() {
       loadJson('msgs', doAfterJsonLoaded)
      }, 5000)
      return
    }
    addMsgEle(msgs.shift())
  }, 3000);
}


loadJson('msgs', doAfterJsonLoaded)
