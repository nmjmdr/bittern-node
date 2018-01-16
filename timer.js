
class timer {
  constructor() {
  }
  start(timeMS, callback) {
    this.timerHandler = setTimeout(()=>{
      callback()
      this.start(timeMS, callback)
    }, timeMS)
  }
  stop() {
    clearTimeout(this.timerHandler)
  }
}

module.exports = timer
