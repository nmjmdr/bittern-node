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

function getRandomizedElectionTimout() {
	return (Math.random()*(ElectionTimeoutMax-ElectionTimeoutMin) + ElectionTimeoutMin)
}


function start(id) {
  dispatcher.register(events.Boot, onBoot)
  dispatcher.register(events.StartFollower, onStartFollower)
  dispatcher.dispatch(events.Boot, { id: id })
}

function onBoot(payload) {
  const n = {
    id: payload.id,
    st: {
      mode: modes.Follower
    }
  }
  volatile.set(n)
  store.storeInt(CurrentTermKey,0)
  dispatcher.dispatch(events.StartFollower, null)
}

function startElectionTimer() {
  const timeout = getRandomizedElectionTimout()
  timer.start(timeout)
}

function onStartFollower(payload) {
  const node = volatile.get()
  if (node.st.mode != modes.Follower) {
		console.log("Panic: ")
	}
  startElectionTimer()
}

module.exports = {
  start: start
}
