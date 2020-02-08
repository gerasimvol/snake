export function copy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function random (from, to) {
  return Math.floor(Math.random() * to) + from
}
