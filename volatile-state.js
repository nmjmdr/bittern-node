let node = {}

function set(n) {
  node = {
    ...n
  }
}

function get() {
  return node
}

module.exports = {
  set: set,
  get: get
}
