const modes = require('./modes')
const store = require('./store')
const dispatcher = require('./dispatcher')
const volatile = require('./volatile-state')
const events = require('./events')
const timer = require('./timer')

const TimeBetweenHeartbeats = 30
const CurrentTermKey = "CurrentTerm"

const ElectionTimeoutMax = 150
const ElectionTimeoutMin = 100

const electionTimer = new timer()

function getRandomizedElectionTimout() {
	return (Math.random()*(ElectionTimeoutMax-ElectionTimeoutMin) + ElectionTimeoutMin)
}


function start(id) {
  dispatcher.register(events.Boot, onBoot)
  dispatcher.register(events.StartFollower, onStartFollower)
  dispatcher.register(events.ElectionTimerTimedout, onElectionTimerTimedout)
  dispatcher.dispatch(events.Boot, { id: id })

}

function onBoot(payload) {
  const n = {
    id: payload.id,
    st: {
      mode: modes.Follower,
      lastHeardFromALeader: 0,
      electionTimeout: 0
    }
  }
  volatile.set(n)
  store.storeInt(CurrentTermKey,0)
  dispatcher.dispatch(events.StartFollower, null)
}

function startElectionTimer(timeout) {
  electionTimer.start(timeout,()=>{
    dispatcher.dispatch(events.ElectionTimerTimedout, null)
  })
}

function onStartFollower(payload) {
  const node = volatile.get()
  if (node.st.mode != modes.Follower) {
		console.log("Panic: ")
	}
  node.st.electionTimeout = getRandomizedElectionTimout()
  volatile.set(node)
  startElectionTimer(node.st.electionTimeout)
}

function hasHeardFromALeader() {
  const n = volatile.get()
	return (new Date().getTime() - n.st.lastHeardFromALeader) < n.st.electionTimeout
}

function onElectionTimerTimedout(payload) {
  console.log("Has heard from leader: ", hasHeardFromALeader())
  if(hasHeardFromALeader()) {
    return
  }

}

module.exports = {
  start: start
}
