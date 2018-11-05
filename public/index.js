let msgs = []
let streamLoop = null
const msgsEle = document.querySelector('#stream')
const pauseEle = document.getElementById('stop-or-start')


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
    addMsgEle('Waiting for messages.')
    setTimeout(function() {
     loadJson('msgs', doAfterJsonLoaded)
    }, 5000)
    return
  }
  addMsgEle(msgs.shift())
  startStream(msgs)
}


function listenPauseButton() {
  let pauseHtml = '&#9646;&#9646;'
  let playHtml = '&#9654;'
  pauseEle.onclick = function(eve) {
    eve.preventDefault()
    console.log(eve.target.name)
    if(eve.target.className == 'pause') {
      clearInterval(streamLoop)
      eve.target.className = 'start'
      eve.target.innerHTML = playHtml
    }
    else {
      startStream()
      eve.target.className = 'pause'
      eve.target.innerHTML = pauseHtml
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


function main() {
  listenPauseButton()
  loadJson('msgs', doAfterJsonLoaded)
}


main()
