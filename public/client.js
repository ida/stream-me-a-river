let msgs = []
let streamLoop = null
const msgsEle = document.querySelector('#stream')
const pauseEle = document.querySelector('#stop-or-start')

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

function doAfterJsonLoaded(responseText) {
  let msgs = responseText
  msgs = JSON.parse(msgs)
  if(msgs.length < 1) {
    addMsgEle('<div class="post">Waiting for more messages ...\
<div class="meta">... your friendly streamer.</div></div>')
      setTimeout(function() {
       loadJson('msgs', doAfterJsonLoaded)
      }, 5000)
    return
  }
  addMsgEle(msgs.shift())
  startStream(msgs)
}


function listenPauseButton() {   
  pauseEle.onclick = function(eve) {
    if(eve.target.innerHTML.trim() == 'Pause') {
      clearInterval(streamLoop)
      eve.target.innerHTML = 'Start'
    }
    else {
      startStream()
      eve.target.innerHTML = 'Pause'
    }
  }
}


function startStream() {
  streamLoop = setInterval(function() {
    if(msgs.length < 2) {
      clearInterval(streamLoop)
      setTimeout(function() {
       loadJson('msgs', doAfterJsonLoaded)
      }, 5000)
      return
    }
    addMsgEle(msgs.shift())
  }, 5000);
}

listenPauseButton()
loadJson('msgs', doAfterJsonLoaded)