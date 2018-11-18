const msgsEle = document.querySelector('#stream')
const pauseEle = document.getElementById('stop-or-start')


let msgs = []

let streamLoop = null
let waitingForMessagesAmount = 0

function getHeight(ele) {
  return parseFloat(getComputedStyle(ele).getPropertyValue('height'))
}


function addMsgEle(msg, className='') {
  const msgEle = document.createElement('div')
  msgEle.className = className
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
  msgs = responseText
  msgs = JSON.parse(msgs)

  if(msgs.length < 1) {
    if(msgsEle.firstChild.className !== undefined
    && msgsEle.firstChild.className.indexOf('info') != -1) {
      msgsEle.firstChild.remove()
    }
    waitingForMessagesAmount += 1
    if(waitingForMessagesAmount == 1)   addMsgEle('Waiting for messages.', 'info')
    if(waitingForMessagesAmount == 2)   addMsgEle('Still waiting for messages.', 'info')
    if(waitingForMessagesAmount == 3)   addMsgEle('No messages, gonna wait.', 'info')
    if(waitingForMessagesAmount == 4) { addMsgEle('Need to wait a little more.', 'info')
      waitingForMessagesAmount = 0
    }
    setTimeout(function() {
     loadJson('msgs', doAfterJsonLoaded)
    }, 5000)
    return
  }


  addMsgEle(msgs.shift())

  startRiver(msgs)

}


function listenPauseButton() {
  let pauseHtml = '&#9646;&#9646;'
  let playHtml = '&#9654;'
  pauseEle.onclick = function(eve) {
    eve.preventDefault()
    if(eve.target.className == 'pause') {
      clearInterval(streamLoop)
      eve.target.className = 'start'
      eve.target.innerHTML = playHtml
    }
    else {
      startRiver()
      eve.target.className = 'pause'
      eve.target.innerHTML = pauseHtml
    }
  }
}


function startRiver() {
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
  msgs = []
  listenPauseButton()
  loadJson('msgs', doAfterJsonLoaded)
}


main()
