const EventEmitter = require('events');

class Emitter extends EventEmitter {}
const emitter = new Emitter();

function dispatch(evt, payload){
  emitter.emit(evt,payload)
}

function register(evt, handler) {
  emitter.on(evt, handler)
}

module.exports = {
  dispatch: dispatch,
  register: register
}
