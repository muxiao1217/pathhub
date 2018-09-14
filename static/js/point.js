export default class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.selected = false
  }

  click () {
    this.selected = true
  }

  cancelClick () {
    this.selected = false
  }

  equal (point) {
    return point.x === this.x && point.y === this.y
  }
}
